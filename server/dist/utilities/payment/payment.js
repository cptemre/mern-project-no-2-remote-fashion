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
const createPayment = ({ name, email, phone, unit_amount, currency, productId, street: line1, city, postalCode, country, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // CREATE CUSTOMER
        const customer = yield stripe.customers.create({
            name,
            email,
            phone,
            address: { city, country, line1, postal_code: postalCode.toString() },
        });
        // CREATE PRODUCT
        const product = yield stripe.products.create({
            name: "Online Fashion",
            description: "Online fashion order payment",
        });
        // CREATE PRICE
        const price = yield stripe.prices.create({
            unit_amount,
            currency,
            product: productId,
        });
        // PAYMENT INTENT TO GET ID IN CONTROLLER TO ADD IT TO THE ORDER MODEL
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: unit_amount,
            currency,
            customer: customer.id,
            payment_method_types: ["card"],
            payment_method_options: {
                card: {
                    request_three_d_secure: "automatic",
                },
            },
        });
        return { paymentIntent };
    }
    catch (error) {
        console.error(error);
    }
});
exports.default = createPayment;
