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
const sendEmail_1 = __importDefault(require("./sendEmail"));
const forgotPasswordEmail = ({ userEmail, userName, verificationToken: passwordToken, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientAddress = process.env.CLIENT_ADDRESS;
        const clientLink = `${clientAddress}/forgot-password?passwordToken=${passwordToken}&email=${userEmail}`;
        const html = `<h1>HELLO ${userName}</h1>\n<p>Please click this link to reset your password: <a href=${clientLink}>click here</a></p>`;
        const subject = "Password Reset";
        return (0, sendEmail_1.default)({
            to: userEmail,
            subject,
            html,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = forgotPasswordEmail;
