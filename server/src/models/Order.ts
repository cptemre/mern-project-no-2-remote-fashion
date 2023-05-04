// MONGOOSE
import mongoose, { Schema, model, Types, ObjectId } from "mongoose";
// INTERFACES
import {
  SingleOrderSchemaInterface,
  SingleOrderModelInterface,
  OrderSchemaInterface,
} from "../utilities/interfaces/models";
// VALUES ARRAY
import { currencyList, orderStatusValues } from "../utilities/categories";
// MODELS
import Product from "./Product";
// UTILITIES
import { findDocumentByIdAndModel } from "../utilities/controllers";

const SingleOrderSchema = new Schema<SingleOrderSchemaInterface>(
  {
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
        message: `status must be one of the followin: ${orderStatusValues}`,
      },
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
    currency: {
      type: String,
      enum: {
        values: currencyList,
        message: `currency must be one of the following: ${currencyList}`,
      },
      default: "gbp",
    },
    cancelTransferId: String,
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
    status: {
      type: String,
      default: "pending",
      enum: {
        values: orderStatusValues,
        message: `status must be one of the followin: ${orderStatusValues}`,
      },
    },
    user: {
      type: Types.ObjectId,
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
  },
  { timestamps: true }
);

SingleOrderSchema.statics.updateProductStock = async function ({
  productId,
  amount,
  operation,
}: {
  productId: string;
  amount: number;
  operation: "+" | "-";
}) {
  try {
    // FIND THE PRODUCT
    const product = await findDocumentByIdAndModel({
      id: productId,
      MyModel: Product,
    });
    // UPDATE STOCK BY OPERATION
    if (operation === "+") product.stock += amount;
    if (operation === "-") product.stock -= amount;
    // SAVE PRODUCT WITH ITS NEW STOCK VALUE
    await product.save();
  } catch (error) {
    console.log(error);
  }
};
// SAVE SINGLE ORDER FUNCTION CALL TO DECREASE STOCK VALUES OF THE PRODUCT
SingleOrderSchema.pre("save", async function () {
  if (this.isModified(this.status)) {
    console.log(this.status);

    // IF STATUS IS SAVED AS REPAYED THEN ADD IT BACK TO STOCK, ELSE IF IT IS NOT FAILED DECREASE THE STOCK
    let operation: "+" | "-" | "" =
      this.status === "canceled" || this.status === "failed"
        ? "+"
        : this.status === "paid"
        ? "-"
        : "";
    // RETURN BACK IF IT IS FAILED
    if (operation === "") return;

    await SingleOrder.updateProductStock({
      productId: this.product as string,
      amount: this.amount,
      operation,
    });
  }
});
// DELETE SINGLE ORDER FUNCTION CALL TO INCREASE STOCK VALUES OF THE PRODUCT
SingleOrderSchema.post("findOneAndDelete", async function (doc) {
  await SingleOrder.updateProductStock({
    productId: doc.product as string,
    amount: doc.amount,
    operation: "+",
  });
});
// SINGLE ORDER MODEL
const SingleOrder = model<
  SingleOrderSchemaInterface,
  SingleOrderModelInterface
>("SingleOrder", SingleOrderSchema);

// ORDER MODEL
const Order = model<OrderSchemaInterface>("Order", OrderSchema);

export { Order, SingleOrder };
