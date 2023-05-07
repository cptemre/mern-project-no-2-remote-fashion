import { ObjectId } from "mongoose";
// INTERFACES
import {
  AddressInterface,
  PhoneNumberInterface,
  CreditCardInformationInterface,
} from "../models/UserSchemaInterface";
import { CurrencyInterface } from "./CurrencyInterface";

interface StripePaymentArgumentsSchema
  extends CurrencyInterface,
    CreditCardInformationInterface,
    AddressInterface,
    PhoneNumberInterface {
  totalPrice: number;
}

export default StripePaymentArgumentsSchema;
