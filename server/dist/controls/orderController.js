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
    // CLIENT SIDE REQUESTS
    const { currency, cardNumber, expMonth, expYear, cvc, street, city, postalCode, country, state, } = req.body;
    // GET CART ITEMS FROM THE USER DOCUMENT
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        MyModel: models_1.User,
    });
    const cartItems = user.cartItems;
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
    // *LOOP THROUGH CLIENT CART ITEMS OBJECT
    for (let i = 0; i < cartItems.length; i++) {
        // SINGLE CART ITEM BY CLIENT
        const { amount, price, tax, product } = cartItems[i];
        //
        const productId = product.toString();
        yield (0, controllers_1.priceAndExchangedPriceCompare)({
            price,
            tax,
            productId,
            currency,
            Product: models_1.Product,
        });
        // CREATE A SINGLE ORDER
        const singleOrder = yield models_1.SingleOrder.create({
            amount,
            price,
            currency,
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
            product,
        });
        // APPEND THIS ORDER TO ORDERITEMS ARRAY
        orderItems = [...orderItems, singleOrder];
        // PRODUCT ORDER PRICE AS GBP
        const productOrderPrice = amount * price;
        // TAX VALUE WITHOUT DOT
        const taxValueWithoutDot = Number((tax / 100).toString().replace(".", ""));
        // APPEND TAX RATE TO EVERY ITEM DEPENDS ON THEIR TAX VALUE
        const productOrderPriceWithTax = productOrderPrice * taxValueWithoutDot;
        // APPEND PRODUCT ORDER PRICE TO SUBTOTAL
        subTotal += productOrderPriceWithTax;
    }
    // *LOOP END
    // SHIPPING FEE AS GBP. IF TOTAL SHOPPING IS ABOVE 75 GBP THEN FREE
    const shippingFee = subTotal >= 7500 ? 0 : 999;
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
    if (!amount || client_secret || paymentIntentId)
        throw new errors_1.PaymentRequiredError("payment required");
    // CREATE ACTUAL ORDER HERE
    const result = yield models_1.Order.create({
        orderItems,
        shippingFee,
        subTotal,
        totalPrice,
        currency,
        user: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
        clientSecret: client_secret,
        paymentIntentID: paymentIntentId,
    });
    // SENT CLIENT SECRET TO THE CLIENT
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ msg: "order created", result, client_secret });
});
exports.createOrder = createOrder;
const getAllSingleOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERIES
    const { amount, priceVal, tax, product: productId, orderPage, } = req.body;
    // EMPTY QUERY
    const query = {};
    // SET QUERY KEYS AND VALUES
    if (amount)
        query.amount = amount;
    if (priceVal)
        query.price = (0, controllers_1.gteAndLteQueryForDb)(priceVal);
    if (tax)
        query.tax = tax;
    if (productId)
        query.product = productId;
    // IF USER IS NOT ADMIN THEN ADD TO QUERY OF THE USERS ID TO FIND ONLY RELATED SINGLE ORDERS
    if (req.user && req.user.userType !== "admin")
        query.user = req.user._id;
    // FIND DOCUMENTS OF SINGLE ORDERS
    const singleOrder = models_1.SingleOrder.find(query);
    // COUNT THE DOCUMENTS
    const singleOrderLength = singleOrder.countDocuments();
    // LIMIT AND SKIP VALUES
    const myLimit = 10;
    const { limit, skip } = (0, controllers_1.limitAndSkip)({ limit: myLimit, page: orderPage });
    const result = yield singleOrder.skip(skip).limit(limit);
    // RESPONSE
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "single orders fetched", result, lenght: singleOrderLength });
});
exports.getAllSingleOrders = getAllSingleOrders;
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERIES
    const { product: productId } = req.params;
    // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
    if (!productId)
        throw new errors_1.BadRequestError("product id is required");
    // FIND THE SINGLE ORDER
    const singleOrder = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: productId,
        MyModel: models_1.SingleOrder,
    });
    // CHECK USER MATCHES WITH THE SINGLE ORDER USER
    if (req.user)
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({
            user: req.user,
            userId: singleOrder.user.toString(),
        });
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
    isShipping
        ? (query.isShipping = isShipping)
        : (query.isShipping = !isShipping);
    if (status)
        query.status = status;
    // IF USER IS NOT ADMIN THEN ADD TO QUERY OF THE USERS ID TO FIND ONLY RELATED SINGLE ORDERS
    if (req.user && req.user.userType !== "admin")
        query.user = req.user._id;
    if (priceVal)
        query.price = (0, controllers_1.gteAndLteQueryForDb)(priceVal);
    // ! HERE CALCULATE THE PRICE TO GBP
    // FIND ALL ORDERS WITH QUERY
    const order = models_1.Order.find(query);
    // COUNT THE DOCUMENTS
    const orderLength = order.countDocuments();
    // LIMIT AND SKIP
    const myLimit = 10;
    const { limit, skip } = (0, controllers_1.limitAndSkip)({ limit: myLimit, page: orderPage });
    const result = yield order.skip(skip).limit(limit);
    // RESPONSE
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "orders fetched", result, length: orderLength });
});
exports.getAllOrders = getAllOrders;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERY
    const { order: orderId } = req.params;
    // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
    if (!orderId)
        throw new errors_1.BadRequestError("order id is required");
    // FIND THE SINGLE ORDER
    const order = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: orderId,
        MyModel: models_1.Order,
    });
    // CHECK USER MATCHES WITH THE ORDER USER
    if (req.user)
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({
            user: req.user,
            userId: order._id.toString(),
        });
    // RESPONSE
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "single order fetched", result: order });
});
exports.getOrder = getOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET ORDER ID FROM THE CLIENT
    const { id: orderId } = req.params;
    // CHECK IF SINGLE ORDER ID IS PROVIDED
    if (!orderId)
        throw new errors_1.BadRequestError("order id is required");
    // GET USER ID
    const { status, singleOrderId, destination, } = req.body;
    // CHECK IF BODY VARIABLES ARE PROVIDED
    if (!status || !singleOrderId)
        throw new errors_1.BadRequestError("status and single order id are required");
    // GET ORDER
    const order = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: orderId,
        MyModel: models_1.Order,
    });
    // CHECK IF CURRENT USER IS NOT ADMIN AND ORDER USER ID IS NOT EQUAL TO USER ID
    if (req.user)
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({
            user: req.user,
            userId: order.user.toString(),
        });
    // FIND THIS SINGLE ORDER IN DOCUMENTS
    const singleOrder = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: singleOrderId,
        MyModel: models_1.SingleOrder,
    });
    // IF IT IS A CANCELATION THEN PAY BACK THE MONEY
    if (status === "canceled") {
        if (!destination)
            throw new errors_1.BadRequestError("destination account no is required");
        const amount = singleOrder.amount;
        const currency = order.currency;
        const transfer = yield (0, payment_1.transferMoney)({ amount, currency, destination });
        singleOrder.cancelTransferId = transfer.id;
        // ORDER PAYMENT DECREASE CHANGE DUE TO CANCELATION
        order.subTotal -= singleOrder.amount;
        order.totalPrice -= singleOrder.amount;
        // UPDATE SINGLE ORDER IN ORDER FOR ITS CANCELATION
        order.orderItems.forEach((orderItem) => {
            if (orderItem._id === singleOrder._id) {
                orderItem.cancelTransferId = singleOrder.cancelTransferId;
            }
        });
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
