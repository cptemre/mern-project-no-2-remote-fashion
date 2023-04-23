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
// MODELS
const models_1 = require("../models");
// UTILITIES
const controllers_1 = require("../utilities/controllers");
// PAYMENT
const payment_1 = __importDefault(require("../utilities/payment/payment"));
// ERRORS
const errors_1 = require("../errors");
// HTTP STATUS CODES
const http_status_codes_1 = require("http-status-codes");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // CLIENT SIDE REQUESTS
    const { item: cartItems, currency, cardNumber, expMonth, expYear, cvc, street, city, postalCode, country, state, } = req.body;
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
        const { amount, price, tax, product: productId } = cartItems[i];
        // FIND THE DOCUMENT OF PRODUCT
        const product = yield (0, controllers_1.findDocumentByIdAndModel)({
            id: productId,
            MyModel: models_1.Product,
        });
        if (price !== product.price)
            throw new errors_1.BadRequestError("price does not match");
        // CREATE A SINGLE ORDER
        const singleOrder = yield models_1.SingleOrder.create({
            amount,
            price,
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            product,
        });
        // APPEND THIS ORDER TO ORDERITEMS ARRAY
        orderItems = [...orderItems, singleOrder];
        // PRODUCT ORDER PRICE AS GBP
        const productOrderPrice = amount * price;
        // TAX VALUE WITHOUT DOT
        const taxValueWithoutDot = Number((tax / 10000).toString().replace(".", ""));
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
    const paymentIntent = yield (0, payment_1.default)({
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
    const order = yield models_1.Order.create({
        orderItems,
        shippingFee,
        subTotal,
        totalPrice,
        user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
        clientSecret: client_secret,
        paymentIntentID: paymentIntentId,
    });
    // SENT CLIENT SECRET TO THE CLIENT
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "order created", client_secret });
});
// *ONLY FOR ADMIN
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
    // FIND DOCUMENTS OF SINGLE ORDERS
    const singleOrder = models_1.SingleOrder.find(query);
    // LIMIT AND SKIP VALUES
    const myLimit = 10;
    const { limit, skip } = (0, controllers_1.limitAndSkip)({ limit: myLimit, page: orderPage });
    const result = yield singleOrder.skip(skip).limit(limit);
    // RESPONSE
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "single orders fetched", result });
});
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERIES
    const { product: productId, user: userId, } = req.body;
    // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
    if (!productId || !userId)
        throw new errors_1.BadRequestError("product and user id is required");
    // FIND THE SINGLE ORDER
    const singleOrder = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: productId,
        MyModel: models_1.SingleOrder,
    });
    // CHECK USER MATCHES WITH THE SINGLE ORDER USER
    if (req.user)
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({ user: req.user, userId });
    // RESPONSE
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "single order fetched", result: singleOrder });
});
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERIES
    const { isShipping, status, user: userId, orderPage, priceVal, currency, } = req.body;
    // EMPTY QUERY
    const query = {};
    // SET QUERY KEY AND VALUES
    isShipping
        ? (query.isShipping = isShipping)
        : (query.isShipping = !isShipping);
    if (status)
        query.status = status;
    // COMPARE IF USER ID AND AUTHORIZED USERS ARE SAME
    if (req.user && userId) {
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({
            user: req.user,
            userId: userId,
        });
    }
    if (priceVal)
        query.price = (0, controllers_1.gteAndLteQueryForDb)(priceVal);
    // ! HERE CALCULATE THE PRICE TO GBP
    // FIND ALL ORDERS WITH QUERY
    const order = models_1.Order.find(query);
    // LIMIT AND SKIP
    const myLimit = 10;
    const { limit, skip } = (0, controllers_1.limitAndSkip)({ limit: myLimit, page: orderPage });
    const result = yield order.skip(skip).limit(limit);
    // RESPONSE
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "orders fetched", result });
});
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERIES
    const { order: orderId, user: userId } = req.body;
    // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
    if (!orderId || !userId)
        throw new errors_1.BadRequestError("order and user id is required");
    // FIND THE SINGLE ORDER
    const order = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: orderId,
        MyModel: models_1.Order,
    });
    // CHECK USER MATCHES WITH THE SINGLE ORDER USER
    if (req.user)
        (0, controllers_1.userIdAndModelUserIdMatchCheck)({ user: req.user, userId });
    // RESPONSE
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "single order fetched", result: order });
});
