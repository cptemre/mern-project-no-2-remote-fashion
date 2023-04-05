"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator = require("validator");
// * SCHEMA
const UserSchema = new mongoose_1.Schema({
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
        maxlength: [55, "user password can not be more than 55 characters"],
    },
    userType: {
        type: String,
        required: [true, "user type is required"],
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
    verificationToken: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verified: Date,
}, { timestamps: true });
// * HASH PASSWORD BEFORE SAVING THE USER
UserSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        // IF PASSWORD DID NOT MODIFIED RETURN FUNCTION
        if (!this.isModified("password"))
            return;
        // SAVE USER NAME AND SURNAME AS UPPERCASE IF MODIFIED
        if (this.isModified("name"))
            this.name = this.name.toUpperCase();
        if (this.isModified("surname"))
            this.surname = this.surname.toUpperCase();
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hash = yield bcryptjs_1.default.hash(this.password, salt);
        this.password = hash;
    });
});
// * MODEL
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
