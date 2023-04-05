// MODEL
import User from "../models/User";
// EXPRESS VARS
import { Request, Response } from "express";
// HTTP CODES
import { StatusCodes } from "http-status-codes";
// CRYPTO
import crypto from "crypto";
// ERRORS
import { ConflictError, UnauthorizedError } from "../errors";
// SEND EMAIL
import { registerEmail } from "../utilities/email";
// INTERFACES
import {
  UserSchemaInterface,
  RegisterVerificationInterface,
} from "../utilities/interfaces";
// * CREATE A NEW USER
const registerUser = async (req: Request, res: Response) => {
  // BODY REQUESTS

  const {
    name,
    surname,
    email,
    password,
    phoneNumber,
    address,
    cardNumber,
    avatar,
  }: UserSchemaInterface = req.body;

  let { userType }: Pick<UserSchemaInterface, "userType"> = { userType: "" };

  // CHECK IF USER EXISTS
  const user = await User.findOne({ email });

  // THROW ERROR IF USER EXISTS
  if (user) {
    throw new ConflictError("user already exists");
  }

  // IF THERE ARE NO USERS, FIRST ACCOUNT WILL BE AN ADMIN
  const isUsers = await User.find({}).countDocuments();

  // THERE CAN ONLY BE ONE ADMIN
  if (!isUsers) userType = "admin";
  else {
    if (userType === "admin") throw new Error("Error");
    else userType = req.body;
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");

  // CREATE USER IF REQUIRED CREDENTIALS EXIST
  if (name && surname && email && password && userType) {
    const user = await User.create({
      name,
      surname,
      email,
      password,
      userType,
      phoneNumber,
      address,
      cardNumber,
      avatar,
      verificationToken,
    });

    await registerEmail(<RegisterVerificationInterface>{
      userEmail: user.email,
      userName: user.name,
      verificationToken: user.verificationToken,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "user created", verificationToken });
  } else throw new UnauthorizedError("missing credentials");
};

export { registerUser };
