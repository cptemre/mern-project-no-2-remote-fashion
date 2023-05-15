// MONGOOSE
import mongoose, { Schema, model, Types, ObjectId } from "mongoose";
// INTERFACES
import {
  SingleOrderSchemaInterface,
  OrderSchemaInterface,
} from "../utilities/interfaces/models";
// VALUES ARRAY
import { currencyList, orderStatusValues } from "../utilities/categories";
// MODELS
import Product from "./Product";
// UTILITIES
import { findDocumentByIdAndModel } from "../utilities/controllers";
// CATEGORY
import { recievedMsg, orderInformationArray } from "../utilities/categories";

const SingleOrderSchema = new Schema<SingleOrderSchemaInterface>(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
    },
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
        values: orderStatusValues,
        message: `status must be one of the following: ${orderStatusValues}`,
      },
    },
    orderInformation: {
      type: String,
      enum: {
        values: orderInformationArray,
        message: `order information must be one of the following: ${orderInformationArray}`,
      },
      default: recievedMsg,
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
      type: Types.ObjectId,
      required: [true, "user id is required"],
    },
    product: {
      type: Types.ObjectId,
      required: [true, "product id is required"],
    },
    seller: {
      type: Types.ObjectId,
      required: [true, "seller id is required"],
    },
    order: Types.ObjectId,
    courier: Types.ObjectId,
    currency: {
      type: String,
      enum: {
        values: currencyList,
        message: `currency must be one of the following: ${currencyList}`,
      },
      default: "gbp",
    },
    deliveryDateToCargo: Date,
    deliveryDateToUser: Date,
    cancelationDate: Date,
    refundId: String,
  },
  { timestamps: true }
);

const OrderSchema = new Schema<OrderSchemaInterface>(
  {
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
        values: currencyList,
        message: `currency must be one of the following: ${currencyList}`,
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
      type: Types.ObjectId,
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
  },
  { timestamps: true }
);

// SINGLE ORDER MODEL
const SingleOrder = model<SingleOrderSchemaInterface>(
  "SingleOrder",
  SingleOrderSchema
);

// ORDER MODEL
const Order = model<OrderSchemaInterface>("Order", OrderSchema);

export { Order, SingleOrder };
