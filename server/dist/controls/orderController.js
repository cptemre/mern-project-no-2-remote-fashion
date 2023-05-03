"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyExchange = exports.updateOrder = exports.getSingleOrder = exports.getAllSingleOrders = exports.getOrder = exports.getAllOrders = exports.createOrder = void 0;
// MODELS
const models_1 = require("../models");
// UTILITIES
const controllers_1 = require("../utilities/controllers");
// PAYMENT
const payment_1 = require("../utilities/payment/payment");
// ERRORS
const errors_1 = require("../errors");
// HTTP STATUS CODES
const http_status_codes_1 = require("http-status-codes");
const currencyExchangeRates_1 = __importDefault(require("../utilities/payment/currencyExchangeRates"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // TODO COUNTRY MUST BE CAPITAL SHORT NAME SUCH AS US. CREATE AN INTERFACE FOR IT
    // CLIENT SIDE REQUESTS
    const { currency, cardNumber, expMonth, expYear, cvc, street, city, postalCode, country, state, } = req.body;
    // GET CART ITEMS FROM THE USER DOCUMENT
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        MyModel: models_1.User,
    });
    //
    const to = currency.toUpperCase();
    // TODO CLIENT MUST CHECK CART ITEM PRODUCT PRICE AND REST OF THE PARAMATERS FOR ANY CHANGE BEFORE SENDING A CREATE ORDER REQUEST
    const cartItems = user.cartItems;
    if (cartItems && cartItems.length < 1)
        throw new errors_1.BadRequestError("there must be at least one product to order from your cart");
    // THROW AN ERROR IF THERE IS NO CART ITEMS, CURRENCY, PHONE OR ADDRESS INFO
    if (!cartItems ||
        !currency ||
        !cardNumber ||
        !expMonth ||
        !expYear ||
        !cvc ||
        !street ||
        !city ||
        !postalCode ||
        !country ||
        !state)
        throw new errors_1.BadRequestError("invalid credientals");
    // ALL ORDERS IN AN ARRAY TO APPEND IT TO ORDER MODEL LATER
    let orderItems = [];
    // TOTAL PRICE OF SINGLE ORDERS
    let subTotal = 0;
    let createdSingleOrders = [];
    // *LOOP THROUGH CLIENT CART ITEMS OBJECT
    for (let i = 0; i < cartItems.length; i++) {
        // SINGLE CART ITEM BY CLIENT
        const { amount, price, tax, product } = cartItems[i];
        // THIS VARIABLE WILL BE EQUAL TO PRICE FROM CART.
        // IF CURRENCY IS NOT GBP THEN PRICE WILL BE RECALCULATED AND WILL BE SET TO THIS VARIABLE
        let priceVal = price;
        if (currency !== "gbp") {
            const exchangedPriceVal = yield (0, currencyExchangeRates_1.default)({
                from: "GBP",
                to,
                amount: price,
            });
            if (!exchangedPriceVal)
                throw new errors_1.BadRequestError("price exchange failed");
            priceVal = exchangedPriceVal;
        }
        // EXCHANGED PRICE COMPARATION
        const productId = product.toString();
        yield (0, controllers_1.priceAndExchangedPriceCompare)({
            amount,
            price: priceVal,
            tax,
            productId,
            currency,
            Product: models_1.Product,
        });
        // FIND PRODUCT SELLER
        const productDocument = yield (0, controllers_1.findDocumentByIdAndModel)({
            id: productId,
            MyModel: models_1.Product,
        });
        const seller = productDocument.seller;
        // CREATE A SINGLE ORDER
        const singleOrder = yield models_1.SingleOrder.create({
            amount,
            price: priceVal,
            tax,
            currency,
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            seller,
            product,
        });
        // SEND CREATED SINGLE ORDER TO CREATED SINGLE ORDERS ARRAY FOR CHANGING STATUS LATER
        createdSingleOrders = [...createdSingleOrders, singleOrder];
        // APPEND THIS ORDER TO ORDERITEMS ARRAY
        orderItems = [...orderItems, singleOrder];
        // PRODUCT ORDER PRICE AS GBP
        const productOrderPrice = amount * priceVal;
        // TAX VALUE WITHOUT DOT
        const taxValueWithoutDot = Number((tax / 100).toFixed(2)) * 100;
        // APPEND TAX RATE TO EVERY ITEM DEPENDS ON THEIR TAX VALUE
        const productOrderPriceWithTax = productOrderPrice + taxValueWithoutDot;
        // APPEND PRODUCT ORDER PRICE TO SUBTOTAL
        subTotal += productOrderPriceWithTax;
    }
    // *LOOP END
    // SHIPPING FEE AS GBP. IF TOTAL SHOPPING IS ABOVE 75 GBP THEN FREE
    // THIS WILL BE RECALCULATED IF CURRENCY IS NOT GBP
    let shippingFee = subTotal >= 7500 ? 0 : 999;
    if (currency !== "gbp") {
        const exchangedPriceVal = yield (0, currencyExchangeRates_1.default)({
            from: "GBP",
            to,
            amount: shippingFee,
        });
        if (!exchangedPriceVal)
            throw new errors_1.BadRequestError("price exchange failed");
        shippingFee = exchangedPriceVal;
    }
    // APPEND SHIPPING FEE TO FIND TOTAL PRICE
    const totalPrice = subTotal + shippingFee;
    //
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization denied");
    // CREATE THE PAYMENT INTENT
    const paymentIntent = yield (0, payment_1.createPayment)({
        totalPrice,
        currency,
        cardNumber,
        expMonth,
        expYear,
        cvc,
        street,
        city,
        postalCode,
        country,
        state,
        user: req.user,
    });
    // CHECK IF PAYMENT INTENT EXISTS
    if (!paymentIntent)
        throw new errors_1.PaymentRequiredError("payment required");
    // IF PAYMENT INTENT PROPERTIES DO NOT EXIST THAN THROW AN ERROR
    const { amount, client_secret, id: paymentIntentId } = paymentIntent;
    if (!amount || !client_secret || !paymentIntentId)
        throw new errors_1.PaymentRequiredError("payment required");
    // CLEAR USER CART BECAUSE ORDER IS SUCCESFUL
    user.cartItems = [];
    // CREATE ACTUAL ORDER HERE
    const order = yield models_1.Order.create({
        orderItems,
        shippingFee,
        subTotal,
        totalPrice,
        currency,
        status: "paid",
        user: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
        clientSecret: client_secret,
        paymentIntentID: paymentIntentId,
    });
    // CHANGE ALL SINGLE ORDERS STATUS TO PAID AND SAVE THEM TO THE DATABASE
    for (let i = 0; i < createdSingleOrders.length; i++) {
        createdSingleOrders[i].status = "paid";
        createdSingleOrders[i].order = order._id;
        yield createdSingleOrders[i].save();
    }
    yield user.save();
    // SENT CLIENT SECRET TO THE CLIENT
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ msg: "order created", result: order, client_secret });
});
exports.createOrder = createOrder;
const getAllSingleOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERIES
    const { amount, priceVal, tax, currency, product: productId, seller: sellerId, order: orderId, orderPage, } = req.body;
    // EMPTY QUERY
    const query = {};
    // SET QUERY KEYS AND VALUES
    if (amount)
        query.amount = amount;
    if (priceVal)
        query.price = (0, controllers_1.gteAndLteQueryForDb)(priceVal);
    if (tax)
        query.tax = tax;
    if (currency)
        query.currency = currency;
    if (productId)
        query.product = productId;
    if (sellerId)
        query.seller = sellerId;
    if (orderId)
        query.order = orderId;
    // IF USER IS A REGULAR USER THEN ADD TO QUERY OF THE USERS ID TO FIND ONLY RELATED SINGLE ORDERS
    if (req.user && req.user.userType === "user")
        query.user = req.user._id;
    // LIMIT AND SKIP VALUES
    const myLimit = 10;
    const { limit, skip } = (0, controllers_1.limitAndSkip)({ limit: myLimit, page: orderPage });
    // FIND DOCUMENTS OF SINGLE ORDERS
    const result = yield models_1.SingleOrder.find(query).skip(skip).limit(limit);
    // GET THE TOTAL COUNT OF DOCUMENTS
    const length = yield models_1.SingleOrder.countDocuments(query);
    // RESPONSE
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "single orders fetched", result, length });
});
exports.getAllSingleOrders = getAllSingleOrders;
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g;
    // GET CLIENT SIDE QUERIES
    const { id: singleOrderId } = req.params;
    // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
    if (!singleOrderId)
        throw new errors_1.BadRequestError("single order id is required");
    // FIND THE SINGLE ORDER
    const userId = ((_d = req.user) === null || _d === void 0 ? void 0 : _d.userType) === "user" && ((_e = req.user) === null || _e === void 0 ? void 0 : _e._id);
    const sellerId = ((_f = req.user) === null || _f === void 0 ? void 0 : _f.userType) === "seller" && ((_g = req.user) === null || _g === void 0 ? void 0 : _g._id);
    const singleOrder = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: singleOrderId,
        user: userId,
        seller: sellerId,
        MyModel: models_1.SingleOrder,
    });
    // CHECK USER MATCHES WITH THE SINGLE ORDER USER
    if (req.user) {
        // SET USER OR SELLER ID TO COMPARE WITH ACTUAL ACCOUNT USER
        let userOrSellerId = "";
        if (req.user.userType === "user")
            userOrSellerId = singleOrder.user.toString();
        if (req.user.userType === "seller")
            userOrSellerId = singleOrder.seller.toString();
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({
            user: req.user,
            userId: userOrSellerId,
        });
    }
    // RESPONSE
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "single order fetched", result: singleOrder });
});
exports.getSingleOrder = getSingleOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERIES
    const { isShipping, status, orderPage, priceVal, currency, } = req.body;
    // EMPTY QUERY
    const query = {};
    // SET QUERY KEY AND VALUES
    const sortByShippingFee = isShipping === 1 ? { $gt: 0 } : 0;
    query.shippingFee = sortByShippingFee;
    if (status)
        query.status = status;
    // IF USER IS NOT ADMIN THEN ADD TO QUERY OF THE USERS ID TO FIND ONLY RELATED SINGLE ORDERS
    if (req.user && req.user.userType !== "admin")
        query.user = req.user._id;
    if (priceVal)
        query.price = (0, controllers_1.gteAndLteQueryForDb)(priceVal);
    if (currency)
        query.currency = currency;
    // LIMIT AND SKIP
    const myLimit = 10;
    const { limit, skip } = (0, controllers_1.limitAndSkip)({ limit: myLimit, page: orderPage });
    // FIND DOCUMENTS OF SINGLE ORDERS
    const result = yield models_1.Order.find(query).skip(skip).limit(limit);
    // GET THE TOTAL COUNT OF DOCUMENTS
    const length = yield models_1.Order.countDocuments(query);
    // RESPONSE
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "orders fetched", result, length });
});
exports.getAllOrders = getAllOrders;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    // GET CLIENT SIDE QUERY
    const { id: orderId } = req.params;
    // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
    if (!orderId)
        throw new errors_1.BadRequestError("order id is required");
    // FIND THE SINGLE ORDER
    const userId = ((_h = req.user) === null || _h === void 0 ? void 0 : _h.userType) === "user" && ((_j = req.user) === null || _j === void 0 ? void 0 : _j._id);
    // FIND THE SINGLE ORDER
    const order = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: orderId,
        user: userId,
        MyModel: models_1.Order,
    });
    // CHECK USER MATCHES WITH THE ORDER USER OR IT IS ADMIN
    if (req.user)
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({
            user: req.user,
            userId: order.user.toString(),
        });
    // RESPONSE
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "order fetched", result: order });
});
exports.getOrder = getOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET ORDER ID FROM THE CLIENT
    const { id: singleOrderId } = req.params;
    // CHECK IF SINGLE ORDER ID IS PROVIDED
    if (!singleOrderId)
        throw new errors_1.BadRequestError("single order id is required");
    // GET USER ID
    const { status, destination, } = req.body;
    // CHECK IF BODY VARIABLES ARE PROVIDED
    if (!status || !singleOrderId)
        throw new errors_1.BadRequestError("status and single order id are required");
    // FIND THIS SINGLE ORDER IN DOCUMENTS
    const singleOrder = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: singleOrderId,
        MyModel: models_1.SingleOrder,
    });
    // CHECK IF CURRENT USER IS NOT ADMIN AND ORDER USER ID IS NOT EQUAL TO USER ID
    if (req.user) {
        let userOrSellerId = req.user.userType === "user" ? singleOrder.user : singleOrder.seller;
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({
            user: req.user,
            userId: userOrSellerId.toString(),
        });
    }
    // IF IT IS A CANCELATION THEN PAY BACK THE MONEY
    // TODO IF USER THEN CHECK DELIVED STATUS AND DELIVERY DATE. IF IT IS DELIVERED NOT MORE THAN 2 WEEKS AGO THEN ACCEPT CANCELATION
    // TODO IF SELLER THEN CHECK IF IT IS PAID
    // TODO IF COURIER THEN CHECK IF IT IS PAID
    if (status === "canceled") {
        if (!destination)
            throw new errors_1.BadRequestError("destination account no is required");
        const amount = singleOrder.amount;
        const currency = singleOrder.currency;
        const transfer = yield (0, payment_1.transferMoney)({ amount, currency, destination });
        singleOrder.cancelTransferId = transfer.id;
        // FIND ORDER
        const order = yield (0, controllers_1.findDocumentByIdAndModel)({
            id: singleOrder.order.toString(),
            MyModel: models_1.Order,
        });
        // ORDER PAYMENT DECREASE CHANGE DUE TO CANCELATION
        order.subTotal -= singleOrder.amount;
        order.totalPrice -= singleOrder.amount;
        // UPDATE SINGLE ORDER IN ORDER FOR ITS CANCELATION
        order.orderItems.forEach((orderItem) => {
            if (orderItem._id === singleOrder._id) {
                orderItem.cancelTransferId = singleOrder.cancelTransferId;
            }
        });
        const everySingleOrderCanceled = order.orderItems.every((orderItem) => orderItem.cancelTransferId);
        if (everySingleOrderCanceled)
            order.status = "canceled";
    }
    // UPDATE THE STATUS OF SINGLE ORDER
    singleOrder.status = status;
    // SAVE THE SINGLE ORDER
    yield singleOrder.save();
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "order updated", result: singleOrder });
});
exports.updateOrder = updateOrder;
// THERE WONT BE A DELETE CONTROLER FOR ORDERS
const currencyExchange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, amount } = req.body;
    const result = yield (0, currencyExchangeRates_1.default)({
        from,
        to,
        amount,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "currency exchange fetched", result });
});
exports.currencyExchange = currencyExchange;
