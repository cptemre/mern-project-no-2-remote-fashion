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
  name: string;
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
  refundId?: string;
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
  paymentIntentId: string;
  refunded?: number;
}
export {
  SingleOrderSchemaInterface,
  OrderSchemaInterface,
  CartItemsInterface,
  OrderStatusInterface,
  OrderInformationInterface,
  DeliveryDateInterface,
};
