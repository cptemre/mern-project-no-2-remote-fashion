"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleOrder = exports.Order = void 0;
// MONGOOSE
const mongoose_1 = require("mongoose");
// VALUES ARRAY
const categories_1 = require("../utilities/categories");
// CATEGORY
const categories_2 = require("../utilities/categories");
const SingleOrderSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
        required: [true, "product order amount is required"],
    },
    price: {
        type: Number,
        required: [true, "product order price is required"],
    },
    tax: {
        type: Number,
        required: [true, "product order tax percentage required"],
    },
    status: {
        type: String,
        default: "pending",
        enum: {
            values: categories_1.orderStatusValues,
            message: `status must be one of the following: ${categories_1.orderStatusValues}`,
        },
    },
    orderInformation: {
        type: String,
        enum: {
            values: categories_2.orderInformationArray,
            message: `order information must be one of the following: ${categories_2.orderInformationArray}`,
        },
        default: categories_2.recievedMsg,
    },
    address: {
        type: Object,
        required: [true, "user address is required"],
    },
    phoneNumber: {
        type: Object,
        required: [true, "user phone number is required"],
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        required: [true, "user id is required"],
    },
    product: {
        type: mongoose_1.Types.ObjectId,
        required: [true, "product id is required"],
    },
    seller: {
        type: mongoose_1.Types.ObjectId,
        required: [true, "seller id is required"],
    },
    order: mongoose_1.Types.ObjectId,
    courier: mongoose_1.Types.ObjectId,
    currency: {
        type: String,
        enum: {
            values: categories_1.currencyList,
            message: `currency must be one of the following: ${categories_1.currencyList}`,
        },
        default: "gbp",
    },
    deliveryDateToCargo: Date,
    deliveryDateToUser: Date,
    cancelationDate: Date,
    refundId: String,
}, { timestamps: true });
const OrderSchema = new mongoose_1.Schema({
    orderItems: {
        type: [SingleOrderSchema],
        required: [true, "order item is required"],
    },
    shippingFee: {
        type: Number,
        default: 0,
    },
    subTotal: {
        type: Number,
        required: [true, "order sub total price is required"],
    },
    totalPrice: {
        type: Number,
        required: [true, "order total price is required"],
    },
    currency: {
        type: String,
        enum: {
            values: categories_1.currencyList,
            message: `currency must be one of the following: ${categories_1.currencyList}`,
        },
        default: "gbp",
    },
    address: {
        type: Object,
        required: [true, "user address is required"],
    },
    phoneNumber: {
        type: Object,
        required: [true, "user phone number is required"],
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        required: [true, "user id is required"],
    },
    clientSecret: {
        type: String,
        required: [true, "client secret is required"],
    },
    paymentIntentId: {
        type: String,
        required: [true, "payment intend id is required"],
    },
    refunded: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
// SINGLE ORDER MODEL
const SingleOrder = (0, mongoose_1.model)("SingleOrder", SingleOrderSchema);
exports.SingleOrder = SingleOrder;
// ORDER MODEL
const Order = (0, mongoose_1.model)("Order", OrderSchema);
exports.Order = Order;
