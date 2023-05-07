import { ObjectId, Document, Model } from "mongoose";
import { CurrencyInterface } from "../payment/CurrencyInterface";
import { AddressInterface, PhoneNumberInterface } from "./";
interface OrderStatusInterface {
  status: "pending" | "paid" | "cargo" | "delivered" | "canceled" | "failed";
}

interface OrderInformationInterface {
  orderInformation: string;
}

interface DeliveryDateInterface {
  deliveryDateToCargo?: Date;
  deliveryDateToUser?: Date;
  cancelationDate?: Date;
}

interface SingleOrderSchemaInterface
  extends Document,
    CurrencyInterface,
    OrderStatusInterface,
    OrderInformationInterface,
    DeliveryDateInterface {
  amount: number;
  price: number;
  tax: number;
  address: AddressInterface;
  phoneNumber: PhoneNumberInterface;
  user: ObjectId | string;
  product: ObjectId | string;
  seller: ObjectId | string;
  order: ObjectId | string;
  courier?: ObjectId | string;
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

interface OrderSchemaInterface
  extends CurrencyInterface,
    OrderInformationInterface,
    Document {
  orderItems: SingleOrderSchemaInterface[];
  shippingFee: number;
  subTotal: number;
  totalPrice: number;
  address: AddressInterface;
  phoneNumber: PhoneNumberInterface;
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
  OrderInformationInterface,
  DeliveryDateInterface,
};
