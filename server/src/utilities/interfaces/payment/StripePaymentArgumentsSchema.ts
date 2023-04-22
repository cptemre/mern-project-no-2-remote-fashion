import { ObjectId } from "mongoose";
// INTERFACES
import { AddressInterface } from "../models/UserSchemaInterface";
import CurrencyInterface from "./CurrencyInterface";

interface StripePaymentArgumentsSchema extends CurrencyInterface {
  totalPrice: number;
}

export default StripePaymentArgumentsSchema;
