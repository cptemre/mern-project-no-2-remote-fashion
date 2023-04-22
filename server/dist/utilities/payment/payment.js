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
// STRIPE
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default("sk_test_51MpbFZLI8qA1IP9XKA3aSXeHWooAsUf6lI4yHwOd1ktLbr00pmbNN3H5UKLDNyzQB4WAp1kmmDWLtRoSOxzjzoaK005Glaqe05", {
    apiVersion: "2022-11-15",
});
const createPayment = ({ totalPrice, currency, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // PAYMENT INTENT TO GET ID & SECRET IN CONTROLLER TO ADD IT TO THE ORDER MODEL
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: totalPrice,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return paymentIntent;
    }
    catch (error) {
        console.error(error);
    }
});
exports.default = createPayment;
