// CURRENCY INTERFACE
import CurrencyInterface from "../../payment/CurrencyInterface";
// SINGLE ORDER SCHEMA INTERFACE
import { SingleOrderSchemaInterface } from "../../models";
// STATUS SCHEMA
import { OrderStatusInterface } from "../../models";
// PRICE INTERFACE FOR QUERY GTE & LTE
import { priceQueryInterface } from "../";
// MONGOOSE
import { ObjectId } from "mongoose";

interface SingleOrderQuery {
  amount: number;
  price: { $gte: number | undefined; $lte: number | undefined };
  tax: number;
  product: ObjectId | string;
  orderPage: number;
  user: ObjectId | string;
}
// TO GET REQ FROM CLIENT SIDE
interface OrderClientReqInterface
  extends CurrencyInterface,
    priceQueryInterface,
    OrderStatusInterface {
  isShipping: boolean;
  user: ObjectId | string;
  orderPage: number;
  priceVal: string;
}

export { OrderClientReqInterface, SingleOrderQuery };
