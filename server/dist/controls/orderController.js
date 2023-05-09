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
exports.currencyExchange = exports.updateSingleOrder = exports.getSingleOrder = exports.getAllSingleOrders = exports.getOrder = exports.getAllOrders = exports.createOrder = void 0;
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
// ORDER INFORMATION
const categories_1 = require("../utilities/categories");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // TODO COUNTRY MUST BE CAPITAL SHORT NAME SUCH AS US. CREATE AN INTERFACE FOR IT
    // CLIENT SIDE REQUESTS
    const { currency, cardNumber, expMonth, expYear, cvc, street, city, postalCode, country, state, countryCode, phoneNo, } = req.body;
    // GET CART ITEMS FROM THE USER DOCUMENT
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization failed");
    const userId = req.user._id;
    const user = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: userId,
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
        !state ||
        !countryCode ||
        !phoneNo)
        throw new errors_1.BadRequestError("invalid credientals");
    // INFORMATION TO REACH THE ORDER TO THE USER
    const address = {
        street,
        city,
        postalCode,
        country,
        state,
    };
    const phoneNumber = { countryCode, phoneNo };
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
            address,
            phoneNumber,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            seller,
            product,
        });
        // UPDATE PRODUCT STOCK AFTER ORDER
        productDocument.stock -= amount;
        yield productDocument.save();
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
        countryCode,
        phoneNo,
        user: req.user,
    });
    // CHECK IF PAYMENT INTENT EXISTS
    if (!paymentIntent)
        throw new errors_1.PaymentRequiredError("payment required");
    // IF PAYMENT INTENT PROPERTIES DO NOT EXIST THAN THROW AN ERROR
    const { amount, client_secret, id: paymentIntentId } = paymentIntent;
    if (!amount || !client_secret || !paymentIntentId)
        throw new errors_1.PaymentRequiredError("payment required");
    // CREATE ACTUAL ORDER HERE
    const order = yield models_1.Order.create({
        orderItems,
        shippingFee,
        subTotal,
        totalPrice,
        currency,
        address,
        phoneNumber,
        user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
        clientSecret: client_secret,
        paymentIntentId,
    });
    // CHANGE ALL SINGLE ORDERS STATUS TO PAID AND SAVE THEM TO THE DATABASE
    let updatedSingleOrders = [];
    for (let i = 0; i < createdSingleOrders.length; i++) {
        createdSingleOrders[i].status = "paid";
        createdSingleOrders[i].order = order._id;
        updatedSingleOrders = [...updatedSingleOrders, createdSingleOrders[i]];
        yield createdSingleOrders[i].save();
    }
    // UPDATE ORDER WITH UPDATED SINGLE ORDERS AND SAVE
    order.orderItems = updatedSingleOrders;
    yield order.save();
    // CLEAR USER CART BECAUSE ORDER IS SUCCESFUL
    user.cartItems = [];
    // SAVE USER
    yield user.save();
    // SENT CLIENT SECRET TO THE CLIENT
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ msg: "order created", result: order, client_secret });
});
exports.createOrder = createOrder;
const getAllSingleOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERIES
    const { amount, priceVal, tax, currency, product: productId, order: orderId, orderPage, } = req.body;
    // IF THERE IS NO USER THROW ERROR
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization denied");
    // SEPARATE USER TYPE AND ID FROM USER
    const { userType, _id: id } = req.user;
    // CHECK USER TYPE TO GET PROPER OBJECT TO MERGE WITH MAIN QUERY
    const { userTypeQuery } = (0, controllers_1.getUserTypeQuery)({
        userType,
        id,
    });
    // EMPTY QUERY
    const initialQuery = {};
    // SET QUERY KEYS AND VALUES
    if (amount)
        initialQuery.amount = amount;
    if (priceVal)
        initialQuery.price = (0, controllers_1.gteAndLteQueryForDb)(priceVal);
    if (tax)
        initialQuery.tax = tax;
    if (currency)
        initialQuery.currency = currency;
    if (productId)
        initialQuery.product = productId;
    if (orderId)
        initialQuery.order = orderId;
    // MERGE QUERY WITH USERTYPE QUERY
    const query = Object.assign(Object.assign({}, initialQuery), userTypeQuery);
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
    // GET CLIENT SIDE QUERIES
    const { id: singleOrderId } = req.params;
    // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
    if (!singleOrderId)
        throw new errors_1.BadRequestError("single order id is required");
    // GET USER, SELLER OR COURIER ID AS OBJECT
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization denied");
    const { userType, _id: reqUserId } = req.user;
    const { userTypeQuery } = (0, controllers_1.getUserTypeQuery)({ userType, id: reqUserId });
    // SINGLE ORDER QUERY
    const query = Object.assign({ id: singleOrderId, MyModel: models_1.SingleOrder }, userTypeQuery);
    // FIND THE SINGLE ORDER
    const singleOrder = yield (0, controllers_1.findDocumentByIdAndModel)(query);
    // CHECK USER MATCHES WITH THE SINGLE ORDER USER
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization denied");
    // SET USER OR SELLER ID TO COMPARE WITH ACTUAL ACCOUNT USER
    let userOrSellerId = "";
    if (req.user.userType === "user")
        userOrSellerId = singleOrder.user.toString();
    if (req.user.userType === "seller")
        userOrSellerId = singleOrder.seller.toString();
    (0, controllers_1.userIdAndModelUserIdMatchCheck)({
        userType,
        userId: userOrSellerId,
        reqUserId,
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
    const sortByShippingFee = isShipping === 1 ? { $gt: 0 } : 0;
    query.shippingFee = sortByShippingFee;
    if (status)
        query.status = status;
    // IF USER IS NOT ADMIN THEN ADD TO QUERY OF THE USERS ID TO FIND ONLY RELATED SINGLE ORDERS
    if (req.user && req.user.userType === "admin")
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
    // GET CLIENT SIDE QUERY
    const { id: orderId } = req.params;
    // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
    if (!orderId)
        throw new errors_1.BadRequestError("order id is required");
    // CHECK IF THERE IS A USER
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization denied");
    const { userType, _id: reqUserId } = req.user;
    // FIND THE SINGLE ORDER
    const query = { id: orderId, MyModel: models_1.Order };
    if (userType === "user")
        query.user = reqUserId;
    // FIND THE SINGLE ORDER
    const order = yield (0, controllers_1.findDocumentByIdAndModel)(query);
    // CHECK USER MATCHES WITH THE ORDER USER OR IT IS ADMIN
    (0, controllers_1.userIdAndModelUserIdMatchCheck)({
        userType,
        userId: order.user,
        reqUserId,
    });
    // RESPONSE
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "order fetched", result: order });
});
exports.getOrder = getOrder;
const updateSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET ORDER ID FROM THE CLIENT
    const { id: singleOrderId } = req.params;
    // CHECK IF SINGLE ORDER ID IS PROVIDED
    if (!singleOrderId)
        throw new errors_1.BadRequestError("single order id is required");
    const { courier, orderInformation, } = req.body;
    // CHECK IF BODY VARIABLES ARE PROVIDED
    if (!singleOrderId || !orderInformation)
        throw new errors_1.BadRequestError("invalid credientals");
    // FIND THIS SINGLE ORDER IN DOCUMENTS
    const singleOrder = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: singleOrderId,
        MyModel: models_1.SingleOrder,
    });
    // CHECK IF CURRENT USER IS NOT ADMIN AND ORDER USER ID IS NOT EQUAL TO USER ID
    if (!req.user)
        throw new errors_1.UnauthorizedError("authorization denied");
    let userOrSellerId = req.user.userType === "user" ? singleOrder.user : singleOrder.seller;
    const { userType, _id: reqUserId } = req.user;
    (0, controllers_1.userIdAndModelUserIdMatchCheck)({
        userType,
        userId: userOrSellerId,
        reqUserId,
    });
    // ORDER INFORMATION IN SINGLE ORDER
    const singleOrderInformationValue = singleOrder.orderInformation;
    // QUERY TO CHECK ORDER INFORMATION VALIDATION
    const updateOrderInformationByUserTypeQuery = {
        orderInformation,
        singleOrderInformationValue,
        informationArray: [],
        status: singleOrder.status,
    };
    // CHECK IF USER IS A SELLER AND IF THE SINGLE ORDER STATUS IS PAID
    if (userType === "seller" && singleOrder.status === "paid")
        updateOrderInformationByUserTypeQuery.informationArray =
            categories_1.sellerInformationArray;
    // CHECK IF USER IS A COURIER AND IF THE SINGLE ORDER STATUS IS CARGO
    if (userType === "courier" && singleOrder.status === "cargo")
        updateOrderInformationByUserTypeQuery.informationArray =
            categories_1.cargoInformationArray;
    // CHECK IF USER IS A COURIER AND IF THE SINGLE ORDER STATUS IS CARGO
    if (userType === "courier" && singleOrder.status === "delivered")
        updateOrderInformationByUserTypeQuery.informationArray =
            categories_1.cancelInformationArray;
    // CALL THE ACTUAL FUNCTION FOR VALIDATION OF ORDER INFORMATION
    const { status, isDeliveryToCargo, isDeliveryToUser, isCancelation } = (0, controllers_1.updateOrderInformationByUserType)(updateOrderInformationByUserTypeQuery);
    // UPDATE THE ORDER INFORMATION OF SINGLE ORDER
    singleOrder.orderInformation = orderInformation;
    // IF STATUS IS UNDEFINED THEN THROW AN ERROR
    if (!status)
        throw new errors_1.InternalServerError("single order status is undefined");
    // SET STATUS IF IT IS CHANGED
    if (singleOrder.status !== status) {
        // FIND ORDER
        const order = yield (0, controllers_1.findDocumentByIdAndModel)({
            id: singleOrder.order,
            MyModel: models_1.Order,
        });
        // CARGO IS TRUE AND DATE IS SET
        if (isDeliveryToCargo) {
            if (!courier)
                throw new errors_1.BadRequestError("courier id required");
            singleOrder.deliveryDateToCargo = new Date(Date.now());
            singleOrder.courier = courier;
        }
        // DELIVERED IS TRUE AND DATE IS SET
        if (isDeliveryToUser)
            singleOrder.deliveryDateToUser = new Date(Date.now());
        // IF STATUS IS CHANGED TO CANCELED THEN SET NEW ORDER PRICES
        if (isCancelation) {
            // IF ORDER IS NEVER DELIVERED TO THE USER THEN THEY CAN NOT CANCEL IT
            if (!singleOrder.deliveryDateToUser)
                throw new errors_1.ConflictError("cargo is not delivered");
            // COMPARE DELIVERY DATE AND CURRENT DATE
            const currentDate = new Date(Date.now());
            // DIFFERENCE OF CURRENT AND DELIVERY DATE IN MS
            const diffInMs = currentDate.getTime() - singleOrder.deliveryDateToUser.getTime();
            // A DAY IN MS
            const dayInMs = 24 * 60 * 60 * 1000;
            // DIFFERENCE OF CURRENT AND DELIVERY DATE IN DAYS
            const diffInDays = diffInMs / dayInMs;
            // IF 14 DAYS PASSED THEN CAN NOT CANCEL THE PRODUCT
            if (diffInDays > 14)
                throw new errors_1.ForbiddenError("cancel period is expired");
            const { amount } = singleOrder;
            // TRANSFER PAYMENT BACK TO ACCOUNT NO OF USER
            const refund = yield (0, payment_1.refundPayment)({
                paymentIntentId: order.paymentIntentId,
                amount,
            });
            // UPDATE SINGLE ORDER CANCEL DETAILS
            singleOrder.refundId = refund.id;
            // CANCELED IS TRUE AND SET THE DATE
            singleOrder.cancelationDate = new Date(Date.now());
            // ORDER PAYMENT DECREASE CHANGE DUE TO CANCELATION
            order.subTotal -= singleOrder.amount;
            order.totalPrice -= singleOrder.amount;
            // INCREASE REFUNDED AMOUNT
            if (order.refunded)
                order.refunded += refund.amount;
            // TODO TEST
            yield order.save();
        }
        // UPDATE STATUS BECAUSE IT HAS CHANGED
        const product = yield (0, controllers_1.findDocumentByIdAndModel)({
            id: singleOrder.product,
            MyModel: models_1.Product,
        });
        if (status === "canceled") {
            product.stock += singleOrder.amount;
            yield product.save();
        }
        singleOrder.status = status;
    }
    // SAVE THE SINGLE ORDER
    yield singleOrder.save();
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "order updated", result: singleOrder });
});
exports.updateSingleOrder = updateSingleOrder;
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
