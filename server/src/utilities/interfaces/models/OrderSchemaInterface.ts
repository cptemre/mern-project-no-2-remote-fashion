import { ObjectId, Document, Model } from "mongoose";
import CurrencyInterface from "../payment/CurrencyInterface";

interface SingleOrderSchemaInterface extends Document {
  amount: number;
  price: number;
  tax: number;
  product: ObjectId | string;
}
interface SingleOrderModelInterface extends Model<SingleOrderSchemaInterface> {
  updateProductStock({
    productId,
    amount,
    operation,
  }: {
    productId: string;
    amount: number;
    operation: "+" | "-";
  }): Promise<void>;
}
interface SingleOrderQuery {
  amount: number;
  price: { $gte: number | undefined; $lte: number | undefined };
  tax: number;
  product: ObjectId | string;
  orderPage: number;
}
// FOR CLIENT CART ITEMS LENGTH
interface CartItemsInterface extends SingleOrderSchemaInterface {
  length: number;
  [index: number]: {
    amount: number;
    price: number;
    tax: number;
    product: string;
  };
}

interface OrderSchemaInterface extends CurrencyInterface, Document {
  orderItems: SingleOrderSchemaInterface[];
  shippingFee: number;
  subTotal: number;
  totalPrice: number;
  status: "pending" | "failed" | "paid" | "delivered" | "canceled";
  user: ObjectId | string;
  clientSecret: string;
  paymentIntentID: string;
}
// TO GET REQ FROM CLIENT SIDE
// !CHANGE PRICE
interface OrderClientReqInterface extends CurrencyInterface {
  orderItems: SingleOrderSchemaInterface[];
  isShipping: boolean;
  totalPrice: number;
  status: "pending" | "failed" | "paid" | "delivered" | "canceled";
  user: ObjectId | string;
  orderPage: number;
}
export {
  SingleOrderSchemaInterface,
  OrderSchemaInterface,
  SingleOrderModelInterface,
  CartItemsInterface,
  SingleOrderQuery,
  OrderClientReqInterface,
};
