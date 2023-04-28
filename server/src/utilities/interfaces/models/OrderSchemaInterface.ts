import { ObjectId, Document, Model } from "mongoose";
import CurrencyInterface from "../payment/CurrencyInterface";

interface SingleOrderSchemaInterface extends Document {
  amount: number;
  price: number;
  tax: number;
  status: "pending" | "failed" | "paid" | "delivered" | "canceled";
  user: ObjectId | string;
  product: ObjectId | string;
  cancelTransferId?: string;
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

interface OrderStatusInterface {
  status: "pending" | "failed" | "paid" | "delivered" | "canceled";
}

interface OrderSchemaInterface
  extends CurrencyInterface,
    OrderStatusInterface,
    Document {
  orderItems: SingleOrderSchemaInterface[];
  shippingFee: number;
  subTotal: number;
  totalPrice: number;
  user: ObjectId | string;
  clientSecret: string;
  paymentIntentID: string;
}
export {
  SingleOrderSchemaInterface,
  OrderSchemaInterface,
  SingleOrderModelInterface,
  CartItemsInterface,
  OrderStatusInterface,
};
