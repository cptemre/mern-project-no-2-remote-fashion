import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { UserSchemaInterface } from "../utilities/interfaces/";
const validator = require("validator");

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
        values: ["admin", "user"],
        message: "user type is not accepted",
      },
    },
    phoneNumber: {
      type: Object,
    },
    address: {
      type: Object,
    },
    cardNumber: {
      type: Number,
      minlength: [13, "card number must have at least 13 characters"],
      maxlength: [19, "card number can not be more than 19 characters"],
    },
    avatar: String,
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: String,
    passwordTokenExpDate: Date,
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

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
});

// * MODEL
const User = model("User", UserSchema);

export default User;
