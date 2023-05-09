import { Schema, model, Types } from "mongoose";
import { UserSchemaInterface } from "../utilities/interfaces/models";
const validator = require("validator");
import { createHash } from "../utilities/token";

// * SCHEMA
const UserSchema = new Schema<UserSchemaInterface>(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
      minlength: [2, "user name must be at least 2 characters"],
      maxlength: [25, "user name can not be more than 25 characters"],
    },
    surname: {
      type: String,
      required: [true, "user name is required"],
      minlength: [2, "user surname must be at least 2 characters"],
      maxlength: [25, "user surname can not be more than 25 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "user email is required"],
      minlength: [10, "user email must be at least 10 characters"],
      maxlength: [35, "user email can not be more than 35 characters"],
      validate: {
        validator: validator.isEmail,
        msg: "email is not valid",
      },
    },
    password: {
      type: String,
      required: [true, "user password is required"],
      minlength: [7, "user password must be at least 7 characters"],
      maxlength: [100, "user password can not be more than 55 characters"],
    },
    userType: {
      type: String,
      enum: {
        values: ["admin", "user", "seller", "courier"],
        message: "user type is not accepted",
      },
    },
    phoneNumber: {
      type: Object,
    },
    address: {
      type: Object,
    },
    cardInfo: Object,
    avatar: String,
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: String,
    passwordTokenExpDate: Date,
    cartItems: {
      type: [Object],
      default: [],
    },
    // ! This has to be updated if you change it to seller or courier
    company: {
      type: String,
      minlength: [2, "company name must be at least 2 characters"],
      maxlength: [25, "company name can not be more than 25 characters"],
    },
    accountNo: {
      type: String,
      minlength: [15, "account no must be at least 15 characters"],
      maxlength: [32, "account no can not be more than 32 characters"],
    },
  },
  { timestamps: true }
);

// * HASH PASSWORD BEFORE SAVING THE USER
UserSchema.pre("save", async function () {
  // IF PASSWORD DID NOT MODIFIED RETURN FUNCTION
  if (!this.isModified("password")) return;
  // SAVE USER NAME AND SURNAME AS UPPERCASE IF MODIFIED
  if (this.isModified("name")) this.name = this.name.toUpperCase();
  if (this.isModified("surname")) this.surname = this.surname.toUpperCase();

  const hash = await createHash(this.password);

  this.password = hash;
});

// * MODEL
const User = model("User", UserSchema);

export default User;
