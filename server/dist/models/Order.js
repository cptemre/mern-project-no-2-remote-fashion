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
exports.SingleOrder = exports.Order = void 0;
// MONGOOSE
const mongoose_1 = require("mongoose");
// MODELS
const Product_1 = __importDefault(require("./Product"));
// UTILITIES
const controllers_1 = require("../utilities/controllers");
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
            values: ["pending", "failed", "paid", "delivered", "canceled"],
            message: 'acceptable values: "pending" ,"failed" ,"paid" ,"delivered", "canceled"',
        },
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        required: [true, "user id is required"],
    },
    product: {
        type: mongoose_1.Types.ObjectId,
        required: [true, "product id is required"],
    },
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
    status: {
        type: String,
        default: "pending",
        enum: {
            values: ["pending", "failed", "paid", "delivered", "canceled"],
            message: 'acceptable values: "pending" ,"failed" ,"paid" ,"delivered", "canceled"',
        },
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        required: [true, "user id is required"],
    },
    clientSecret: {
        type: String,
        required: [true, "client secret is required"],
    },
    paymentIntentID: {
        type: String,
        required: [true, "payment intend id is required"],
    },
}, { timestamps: true });
SingleOrderSchema.statics.updateProductStock = function ({ productId, amount, operation, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // FIND THE PRODUCT
            const product = yield (0, controllers_1.findDocumentByIdAndModel)({
                id: productId,
                MyModel: Product_1.default,
            });
            // UPDATE STOCK BY OPERATION
            if (operation === "+")
                product.stock += amount;
            if (operation === "-")
                product.stock -= amount;
            // SAVE PRODUCT WITH ITS NEW STOCK VALUE
            yield product.save();
        }
        catch (error) {
            console.log(error);
        }
    });
};
// SAVE SINGLE ORDER FUNCTION CALL TO DECREASE STOCK VALUES OF THE PRODUCT
SingleOrderSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        // IF STATUS IS SAVED AS FAILED OR CANCELED THEN ADD IT BACK TO STOCK, ELSE DECREASE THE STOCK
        let operation = (this.isModified(this.status) && this.status === "failed") ||
            this.status === "canceled"
            ? "+"
            : "-";
        yield SingleOrder.updateProductStock({
            productId: this.product,
            amount: this.amount,
            operation: "-",
        });
    });
});
// DELETE SINGLE ORDER FUNCTION CALL TO INCREASE STOCK VALUES OF THE PRODUCT
SingleOrderSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        yield SingleOrder.updateProductStock({
            productId: doc.product,
            amount: doc.amount,
            operation: "+",
        });
    });
});
// SINGLE ORDER MODEL
const SingleOrder = (0, mongoose_1.model)("SingleOrder", SingleOrderSchema);
exports.SingleOrder = SingleOrder;
// ORDER MODEL
const Order = (0, mongoose_1.model)("Order", OrderSchema);
exports.Order = Order;
