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
  createMongooseRegex,
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
  const query: {
    name?: { $regex: string; $options: string } | string;
    surname?: { $regex: string; $options: string } | string;
    email?: { $regex: string; $options: string } | string;
    userType?: string;
    country?: string;
    isVerified?: boolean;
  } = {};
  // SET QUERY KEYS
  if (name) query.name = createMongooseRegex(name);
  if (surname) query.surname = createMongooseRegex(surname);
  if (email) query.email = createMongooseRegex(email);
  if (userType) query.userType = userType;
  if (country) query.country = country;
  if (isVerified) query.isVerified = isVerified;
  // LIMIT AND SKIP VALUES
  const myLimit = 20;
  const { limit, skip } = limitAndSkip({ limit: myLimit, page: userPage });
  // GET USERS
  const result = User.find(query).select("-password -passwordToken");
  console.log(query);

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
  if (!req.user) throw new UnauthorizedError("authorization denied");
  const { userType: reqUserType, _id: reqUserId } = req.user;
  userIdAndModelUserIdMatchCheck({
    userType: reqUserType,
    userId,
    reqUserId,
  });
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
    userType,
    phoneNumber,
    address,
    cardInfo,
    avatar,
    cartItems,
    accountNo,
  }: UserSchemaInterface = req.body;

  // IF USER TYPE IS NOT ADMIN, THEN CHECK IF REQUIRED USER AND AUTHORIZED USER HAS THE SAME ID OR NOT. IF NOT SAME THROW AN ERROR
  if (!req.user) throw new UnauthorizedError("authorization denied");
  const { userType: reqUserType, _id: reqUserId } = req.user;
  userIdAndModelUserIdMatchCheck({ userType: reqUserType, userId, reqUserId });
  // CHECK IF THE USER EXISTS
  const user = await findDocumentByIdAndModel({
    id: userId,
    user: userId,
    MyModel: User,
  });
  // MAIN INFO UPDATE
  if (name) user.name = name;
  if (surname) user.surname = surname;
  if (userType) user.userType = userType;
  if (address) user.address = address;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (cardInfo) user.cardInfo = cardInfo;
  if (avatar) user.avatar = avatar;
  if (accountNo) user.accountNo = accountNo;
  // CART ITEMS UPDATE
  // CHECK IF PRICE, TAX AND USER MATCHES WITH THE ACTUAL PRODUCT VALUES

  if (cartItems && cartItems.length) {
    // ONLY ADMIN AND USER CAN SET CART ITEMS FOR USER
    if (reqUserType === "seller" || reqUserType === "courier")
      throw new UnauthorizedError("authorization denied");
    for (let i = 0; i < cartItems.length; i++) {
      const { name, amount, price, tax, product, currency, status, user } =
        cartItems[i];
      //
      if (
        !name ||
        !amount ||
        !price ||
        !tax ||
        !product ||
        !currency ||
        !status ||
        !user
      )
        throw new BadRequestError("invalid credentials");
      // IF USER IS NOT CART ITEM'S USER THEN THROW AN ERROR
      userIdAndModelUserIdMatchCheck({
        userType: reqUserType,
        userId: user,
        reqUserId,
      });
      if (status !== "pending")
        throw new UnauthorizedError("status of the cart item is not correct");
      const productId = product.toString();
      // CHECK IF PRICE AND TAX FROM CLIENT MATCHES WITH DATABASE
      await priceAndExchangedPriceCompare({
        amount,
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
  // HIDE USER PASSWORD AND TOKENS BEFORE SENDING IT TO THE CLIENT
  user.password = "";
  user.verificationToken = "";
  user.passwordToken = "";
  res.status(StatusCodes.OK).json({ msg: "user updated", user });
};

export { getAllUsers, getSingleUser, showCurrentUser, deleteUser, updateUser };
