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
    var _a;
    // CLIENT SIDE REQUESTS
    const { item: cartItems, currency, } = req.body;
    // THROW AN ERROR IF THERE IS NO CART ITEMS OR CURRENCY
    if (!cartItems || currency)
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
        const singleOrder = yield models_1.SingleOrder.create({ amount, price, product });
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
    // CREATE THE PAYMENT INTENT
    const paymentIntent = yield (0, payment_1.default)({ totalPrice, currency });
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
        user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        clientSecret: client_secret,
        paymentIntentID: paymentIntentId,
    });
    // SENT CLIENT SECRET TO THE CLIENT
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "order created", client_secret });
});
// *ONLY FOR ADMIN
const getAllSingleOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERIES
    const { amount, price, tax, product: productId, orderPage, } = req.body;
    // EMPTY QUERY
    const query = {};
    // SET QUERY KEYS AND VALUES
    if (amount)
        query.amount = amount;
    if (price)
        query.price = (0, controllers_1.gteAndLteQueryForDb)(price.toString());
    if (tax)
        query.tax = tax;
    if (productId)
        query.product = productId;
    // FIND DOCUMENTS OF SINGLE ORDERS
    const singleOrder = models_1.SingleOrder.find(query);
    // LIMIT AND SKIP VALUES
    const myLimit = 20;
    const { limit, skip } = (0, controllers_1.limitAndSkip)({ limit: myLimit, page: orderPage });
    const result = yield singleOrder.skip(skip).limit(limit);
    // RESPONSE
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "single orders fetched", result });
});
// *ONLY FOR ADMIN
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERIES
    const { product: productId } = req.body;
    // IF PRODUCT ID DOES NOT EXIST THROW AN ERROR
    if (!productId)
        throw new errors_1.BadRequestError("product id is required");
    // FIND THE SINGLE ORDER
    const singleOrder = yield (0, controllers_1.findDocumentByIdAndModel)({
        id: productId,
        MyModel: models_1.SingleOrder,
    });
    // RESPONSE
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ msg: "single order fetched", result: singleOrder });
});
// *FOR ADMIN AND USER
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // GET CLIENT SIDE QUERIES
    const { orderItems, isShipping, totalPrice, status: productId, user, orderPage, currency, } = req.body;
    // EMPTY QUERY
    const query = {};
});
