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
// SEND GRID MAILSETUP
const mail_1 = __importDefault(require("@sendgrid/mail"));
const sgApiKey = process.env.SENDGRID_API_KEY;
mail_1.default.setApiKey(sgApiKey);
// ! FOR NOW DON'T SEND ANY EMAIL
const sendEmail = ({ to, subject, html }) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = {
        to,
        from: "Remote Shopping <kunduraci2@gmail.com>",
        subject,
        html,
    };
    try {
        return mail_1.default.send(msg);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = sendEmail;
