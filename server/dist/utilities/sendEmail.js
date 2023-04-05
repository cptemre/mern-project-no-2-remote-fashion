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
const mail_1 = __importDefault(require("@sendgrid/mail"));
const sgApiKey = process.env.SENDGRID_API_KEY;
mail_1.default.setApiKey(sgApiKey);
const sendEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    const msg = {
        to: "ekunduraci@edu.cdv.pl",
        from: "Remote Shopping <kunduraci2@gmail.com>",
        subject: "User Register Confirmation",
        html: "<h1>Hello,</h1>\n<p>Please click this link to confirm your account: <a href='#'>click here</a></p>",
    };
    try {
    }
    catch (error) {
        console.log(error);
    }
});
