// CURRENCY INTERFACE
import { CurrencyInterface } from "../../payment/CurrencyInterface";
// SINGLE ORDER SCHEMA INTERFACE
import { SingleOrderSchemaInterface } from "../../models";
// STATUS SCHEMA
import { OrderStatusInterface } from "../../models";
// PRICE INTERFACE FOR QUERY GTE & LTE
import { PriceQueryInterface } from "..";
// MONGOOSE
import { ObjectId } from "mongoose";
// REGEX INTERFACE
import { RegexInterface } from "../";

interface SingleOrderQuery extends CurrencyInterface {
  name: RegexInterface["regex"];
  amount: number;
  price: { $gte: number | undefined; $lte: number | undefined };
  tax: number;
  user: ObjectId | string;
  product: ObjectId | string;
  seller: ObjectId | string;
  order: ObjectId | string;
  courier: ObjectId | string;
  orderPage: number;
}
// TO GET REQ FROM CLIENT SIDE
interface OrderClientReqInterface
  extends CurrencyInterface,
    PriceQueryInterface,
    OrderStatusInterface {
  shippingFee: { $gt: number } | 0;
  user: ObjectId | string;
  orderPage: number;
  priceVal: string;
}

export { OrderClientReqInterface, SingleOrderQuery };
