interface AddressInterface {
  street: string;
  city: string;
  postalCode: number;
  country: string;
}
interface PhoneNumberInterface {
  country: string;
  countryCode: string;
  phoneNumber: number;
}
interface UserSchemaInterface {
  name: string;
  surname: string;
  email: string;
  password: string;
  userType: string;
  phoneNumber?: PhoneNumberInterface;
  address?: AddressInterface;
  cardNumber?: number;
  avatar?: string;
  verificationToken: string;
  isVerified: boolean;
  verified: Date;
}

export default UserSchemaInterface;
