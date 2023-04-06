// MODEL
import { User, Token } from "../models";
// EXPRESS VARS
import { Request, Response } from "express";
// HTTP CODES
import { StatusCodes } from "http-status-codes";
// CRYPTO
import crypto from "crypto";
// BCRYPTJS
import bcrypt from "bcryptjs";
// ERRORS
import { ConflictError, UnauthorizedError } from "../errors";
// SEND EMAIL
import { registerEmail } from "../utilities/email";
// INTERFACES
import {
  UserSchemaInterface,
  RegisterVerificationInterface,
} from "../utilities/interfaces";
import attachJwtToCookie from "../utilities/token/attachJwtToCookie";
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

  let userType = "";
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
    if (userType === "admin") throw new UnauthorizedError("Error");
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
    // ! DELETE TOKEN FROM RES LATER
  } else throw new UnauthorizedError("missing or invalid credentials");
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    // GET TOKEN AND EMAIL FROM THE CLIENT
    const {
      verificationToken,
      email,
    }: { verificationToken: string; email: string } = req.body;
    // CHECK IF USER EXISTS IN OUR DB
    const user = await User.findOne({ email });
    if (!user) throw new UnauthorizedError("missing or invalid credentials");
    // CHECK IF USER'S DB VERIFICATION TOKEN MATCHES WITH THE PROVIDED CLIENT VALUE
    if (user.verificationToken !== verificationToken)
      throw new UnauthorizedError("missing or invalid credentials");
    // UPDATE USER AND SAVE
    user.verificationToken = "";
    user.isVerified = true;
    user.verified = new Date(Date.now());
    await user.save();

    res.status(StatusCodes.OK).json({ msg: "user verified" });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req: Request, res: Response) => {
  // GET EMAIL AND PASSWORD VALUES FROM THE CLIENT
  const { email, password }: { email: string; password: string } = req.body;
  // FIND THE USER
  const user = await User.findOne({ email });
  // CHECK IF USER EXISTS
  if (!user) throw new UnauthorizedError("missing or invalid credentials");
  // COMPARE PASSWORDS
  const isPassword = bcrypt.compare(password, user.password);
  if (!isPassword)
    throw new UnauthorizedError("missing or invalid credentials");
  // IF USER IS VERIFIED
  if (!user.isVerified)
    throw new UnauthorizedError("missing or invalid credentials");
  // CHECK IF USER HAS A VALID TOKEN
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    if (!existingToken.isValid)
      throw new UnauthorizedError("missing or invalid credentials");
    const refreshToken = existingToken.refreshToken;
    attachJwtToCookie({ res, user, refreshToken });
    res.status(StatusCodes.OK).json({ msg: "login success" });
  }
  // IF NOT CREATE NEW TOKENS
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  await Token.create({ refreshToken, ip, userAgent, user: user._id });
  attachJwtToCookie({ res, user, refreshToken });
  res.status(StatusCodes.OK).json({ msg: "login success" });
};

export { registerUser, verifyEmail, login };
