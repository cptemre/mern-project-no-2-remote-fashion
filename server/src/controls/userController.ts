// EXPRESS
import { RequestHandler } from "express";
// MODELS
import { Product, User } from "../models";
// INTERFACES
import { UserSchemaInterface } from "../utilities/interfaces/models";
// STATUS CODES
import { StatusCodes } from "http-status-codes";
// FIND DOCUMENT
import {
  findDocumentByIdAndModel,
  userIdAndModelUserIdMatchCheck,
  limitAndSkip,
  priceAndExchangedPriceCompare,
} from "../utilities/controllers";
// CRYPTO
import { createCrypto } from "../utilities/token";
import currencyExchangeRates from "../utilities/payment/currencyExchangeRates";
import { CurrencyExchangeInterface } from "../utilities/interfaces/payment";
import { BadRequestError, UnauthorizedError } from "../errors";

const getAllUsers: RequestHandler = async (req, res) => {
  // BODY FROM THE CLIENT
  const {
    name,
    surname,
    email,
    userType,
    country,
    isVerified,
    userPage,
  }: Omit<
    UserSchemaInterface,
    "phoneNumber | address | cardNumber | avatar | verificationToken | verified | passwordToken | passwordTokenExpDate"
  > & { country: string; userPage: number } = req.body;
  // QUERY OBJECT TO FIND NEEDED USERS
  const query: Partial<UserSchemaInterface> & { country?: string } = {};
  // SET QUERY KEYS
  if (name) query.name = name;
  if (surname) query.surname = surname;
  if (email) query.email = email;
  if (userType) query.userType = userType;
  if (country) query.country = country;
  if (isVerified) query.isVerified = isVerified;
  // GET USERS
  const result = User.find({ query }).select("-password");
  // LIMIT AND SKIP VALUES
  const myLimit = 20;
  const { limit, skip } = limitAndSkip({ limit: myLimit, page: userPage });
  const users = await result.skip(skip).limit(limit);
  // SEND BACK FETCHED USERS
  res.status(StatusCodes.OK).json({ msg: "users fetched", users });
};

const getSingleUser: RequestHandler = async (req, res) => {
  // GET USER ID FROM PARAMS
  const { id: userId } = req.params;
  // GET THE USER FROM DB
  const user = await findDocumentByIdAndModel({
    id: userId,
    MyModel: User,
  });
  // HIDE USER PASSWORD BEFORE SENDING IT TO THE CLIENT
  user.password = "";
  res.status(StatusCodes.OK).json({ msg: "user fetched", user });
};

const showCurrentUser: RequestHandler = async (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ msg: "current user fetched", user: req.user });
};

const deleteUser: RequestHandler = async (req, res) => {
  // GET USER ID FROM PARAMS
  const { id: userId } = req.params;
  // CHECK IF THE USER HAS PERMISSION TO GET THE USER.
  // HAS TO BE SAME USER OR AN ADMIN TO DO THAT
  // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
  if (req.user?._id) userIdAndModelUserIdMatchCheck({ user: req.user, userId });
  // CHECK IF THE USER EXISTS
  const user = await findDocumentByIdAndModel({
    id: userId,
    MyModel: User,
  });
  // SET THE USER PASSWORD TO EMPTY BEFORE SENDING IT TO THE CLIENT
  user.password = "";
  // DELETE THE USER
  await User.findOneAndDelete({ _id: userId });

  res.status(StatusCodes.OK).json({ msg: "user deleted", user });
};

// ! BEFORE UPDATE CLIENT SHOULD ASK FOR PASSWORD CHECK
const updateUser: RequestHandler = async (req, res) => {
  // GET USER ID FROM PARAMS
  const { id: userId } = req.params;
  // GET UPDATED VALUES FROM THE CLIENT
  const {
    name,
    surname,
    email,
    userType,
    phoneNumber,
    address,
    // ! CHANGE THIS TO OBJECT
    cardInfo,
    avatar,
    cartItems,
    accountNo,
  }: UserSchemaInterface = req.body;
  // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
  if (req.user?._id) userIdAndModelUserIdMatchCheck({ user: req.user, userId });
  // CHECK IF THE USER EXISTS
  const user = await findDocumentByIdAndModel({
    id: userId,
    user: userId,
    MyModel: User,
  });
  // SAVE THE OLD EMAIL TO COMPARE IF CHANGED
  let oldEmail = user.email;
  let isEmailChanged = false;
  // MAIN INFO UPDATE
  if (name) user.name = name;
  if (surname) user.surname = surname;
  if (email) user.email = email;
  if (userType) user.userType = userType;
  if (address) user.address = address;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (cardInfo) user.cardInfo = cardInfo;
  if (avatar) user.avatar = avatar;
  if (accountNo) user.accountNo = accountNo;
  // IF EMAIL DID NOT CHANGE THEN SEND THE RESPONSE
  if (oldEmail !== user.email) {
    isEmailChanged = true;
    // RESET THE VERIFICATION
    user.verificationToken = createCrypto();
    user.verified = undefined;
    user.isVerified = false;
    // ! CLIENT SHOULD CALL LOGOUT AFTER THIS EVENT
  }
  // CART ITEMS UPDATE
  // CHECK IF PRICE, TAX AND USER MATCHES WITH THE ACTUAL PRODUCT VALUES
  if (cartItems && req.user?.userType !== "seller") {
    for (let i = 0; i < cartItems.length; i++) {
      const { price, tax, product, currency, status, user } = cartItems[i];
      // IF USER IS NOT CART ITEM'S USER THEN THROW AN ERROR
      if (req.user && user !== req.user._id)
        throw new UnauthorizedError("user does not match");
      if (status !== "pending")
        throw new UnauthorizedError("status of the cart item is not correct");
      const productId = product.toString();
      // CHECK IF PRICE AND TAX FROM CLIENT MATCHES WITH DATABASE
      await priceAndExchangedPriceCompare({
        price,
        tax,
        productId,
        currency,
        Product,
      });
    }
    // IF NO ERROR THROWN FROM FOR LOOP THEN ADD CART ITEMS TO THE USER
    user.cartItems = cartItems;
  }

  // SAVE THE USER
  await user.save();
  // HIDE USER PASSWORD BEFORE SENDING IT TO THE CLIENT
  user.password = "";

  res
    .status(StatusCodes.OK)
    .json({ msg: "user updated", user, isEmailChanged });
};

export { getAllUsers, getSingleUser, showCurrentUser, deleteUser, updateUser };
