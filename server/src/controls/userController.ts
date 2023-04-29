// EXPRESS
import { RequestHandler } from "express";
// MODELS
import { User } from "../models";
// INTERFACES
import {
  UserSchemaInterface,
  AddressInterface,
  PhoneNumberInterface,
  CartItemsInterface,
} from "../utilities/interfaces/models";
// STATUS CODES
import { StatusCodes } from "http-status-codes";
// FIND DOCUMENT
import {
  findDocumentByIdAndModel,
  userIdAndModelUserIdMatchCheck,
  limitAndSkip,
  cardInfoSplitter,
} from "../utilities/controllers";
// CRYPTO
import { createCrypto } from "../utilities/token";

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
    street,
    city,
    postalCode,
    country,
    countryCode,
    phoneNo,
    state,
    // ! CHANGE THIS TO OBJECT
    card,
    avatar,
    cartItems,
  }: UserSchemaInterface &
    AddressInterface &
    PhoneNumberInterface & { card: string } & CartItemsInterface = req.body;
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
  // ADDRESS OBJECT UPDATE
  if (street && city && postalCode && country && state)
    user.address = {
      street,
      city,
      postalCode,
      country,
      state,
    };
  // PHONE NUMBER UPDATE
  if (countryCode && phoneNo)
    user.phoneNumber = {
      countryCode,
      phoneNo,
    };
  // REST OF THE OPTIONAL KEY UPDATES
  // CARD INFO BODY KEY AND VALUE SPLIT
  let cardInfo = {};
  if (card) cardInfo = cardInfoSplitter({ card });
  if (avatar) user.avatar = avatar;
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
  if (cartItems) user.cartItems = cartItems;

  // SAVE THE USER
  await user.save();
  // HIDE USER PASSWORD BEFORE SENDING IT TO THE CLIENT
  user.password = "";

  res
    .status(StatusCodes.OK)
    .json({ msg: "user updated", user, isEmailChanged });
};

export { getAllUsers, getSingleUser, showCurrentUser, deleteUser, updateUser };
