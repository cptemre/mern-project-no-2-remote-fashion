import { Document } from "mongoose";

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
  expMonth: number;
  expYear: number;
  cvc: string;
}
interface UserSchemaInterface extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  userType: string;
  phoneNumber?: PhoneNumberInterface;
  address?: AddressInterface;
  cardInfo?: CreditCardInformationInterface;
  avatar?: string;
  verificationToken: string;
  isVerified: boolean;
  verified: Date | undefined;
  passwordToken: string;
  passwordTokenExpDate: Date;
}

export {
  UserSchemaInterface,
  AddressInterface,
  PhoneNumberInterface,
  CreditCardInformationInterface,
};
