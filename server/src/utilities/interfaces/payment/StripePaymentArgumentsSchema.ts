import { ObjectId } from "mongoose";
// INTERFACES
import { AddressInterface } from "../models/UserSchemaInterface";
import CurrencyInterface from "./CurrencyInterface";

interface StripePaymentArgumentsSchema
  extends CurrencyInterface,
    AddressInterface {
  unit_amount: number;
  productId: ObjectId | string;
  name: string;
  email: string;
  phone: string;
}

export default StripePaymentArgumentsSchema;
