import { Document } from "mongoose";
import { CartItemsInterface } from "./";
import { ObjectId } from "mongoose";

interface AddressInterface {
  street: string;
  city: string;
  postalCode: number;
  country: string;
  state: string;
}
interface PhoneNumberInterface {
  countryCode: string;
  phoneNo: number;
}

interface CreditCardInformationInterface {
  cardNumber: string;
  expMonth: number | undefined;
  expYear: number | undefined;
  cvc: string;
  [key: string]: string | number | undefined | UserSchemaInterface;
}

interface UserSchemaInterface extends Document {
  _id: ObjectId;
  name: string;
  surname: string;
  email: string;
  password: string;
  userType: "admin" | "user" | "seller" | "courier";
  phoneNumber?: PhoneNumberInterface;
  address?: AddressInterface;
  cardInfo?: CreditCardInformationInterface;
  avatar?: ObjectId[];
  verificationToken: string;
  isVerified: boolean;
  verified: Date | undefined;
  passwordToken: string;
  passwordTokenExpDate: Date;
  cartItems?: CartItemsInterface[];
  company?: string;
  accountNo?: string;
}

export {
  UserSchemaInterface,
  AddressInterface,
  PhoneNumberInterface,
  CreditCardInformationInterface,
};
