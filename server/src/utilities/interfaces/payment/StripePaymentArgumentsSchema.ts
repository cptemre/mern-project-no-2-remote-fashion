import { ObjectId } from "mongoose";
// INTERFACES
import {
  AddressInterface,
  CreditCardInformationInterface,
  UserSchemaInterface,
} from "../models/UserSchemaInterface";
import { CurrencyInterface } from "./CurrencyInterface";

interface StripePaymentArgumentsSchema
  extends CurrencyInterface,
    CreditCardInformationInterface,
    AddressInterface {
  totalPrice: number;
}

export default StripePaymentArgumentsSchema;
