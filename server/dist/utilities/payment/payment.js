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
exports.transferMoney = exports.createPayment = void 0;
// STRIPE
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});
const errors_1 = require("../../errors");
const createPayment = ({ totalPrice, currency, cardNumber, expMonth, expYear, cvc, street, city, postalCode, country, state, user, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!totalPrice ||
            !currency ||
            !expMonth ||
            !expYear ||
            !cvc ||
            !street ||
            !city ||
            !postalCode ||
            !country ||
            !state ||
            !user)
            throw new errors_1.BadRequestError("invalid credentials");
        // NAME OF THE CUSTOMER
        const name = user.name + " " + user.surname;
        // EMAIL OF THE USER
        const email = user.email;
        // PHONE OF THE USER
        const phone = user.phoneNumber
            ? ((_a = user.phoneNumber) === null || _a === void 0 ? void 0 : _a.countryCode) + ((_b = user.phoneNumber) === null || _b === void 0 ? void 0 : _b.phoneNo)
            : "";
        // ADDRESS OF THE CUSTOMER
        const address = {
            city,
            country,
            line1: street,
            postal_code: postalCode.toString(),
            state,
        };
        // * CUSTOMER
        const customer = yield createOrGetCustomer({ name, email, phone, address });
        // * PAYMENT METHOD
        const paymentMethod = yield stripe.paymentMethods.create({
            type: "card",
            card: {
                number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc,
            },
            billing_details: {
                name,
                email,
                address,
                phone,
            },
        });
        // * PAYMENT INTENT TO GET ID & SECRET IN CONTROLLER TO ADD IT TO THE ORDER MODEL
        const paymentIntent = createPaymentIntent({
            totalPrice,
            currency,
            paymentMethodId: paymentMethod.id,
            customerId: customer.id,
        });
        if (!paymentIntent)
            throw new errors_1.PaymentRequiredError("payment required");
        return paymentIntent;
    }
    catch (error) {
        console.error(error);
    }
});
exports.createPayment = createPayment;
// * PAYMENT INTENT TO GET ID & SECRET IN CONTROLLER TO ADD IT TO THE ORDER MODEL
const createPaymentIntent = ({ totalPrice, currency, paymentMethodId, customerId, }) => __awaiter(void 0, void 0, void 0, function* () {
    // PAYMENT IS CONFIRMED DIRECTLY FOR TESTING
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency,
        automatic_payment_methods: {
            enabled: true,
        },
        payment_method: paymentMethodId,
        return_url: process.env.CLIENT_ADDRESS + "/payment-verified",
        customer: customerId,
        confirm: true,
    });
    return paymentIntent;
});
const createOrGetCustomer = ({ name, email, phone, address, }) => __awaiter(void 0, void 0, void 0, function* () {
    let customer;
    // Check if the customer already exists
    const existingCustomer = yield stripe.customers.list({
        email,
        limit: 1,
    });
    if (existingCustomer.data.length > 0) {
        // Retrieve the existing customer
        customer = existingCustomer.data[0];
    }
    else {
        // Create a new customer
        customer = yield stripe.customers.create({
            name,
            email,
            phone,
            address,
        });
    }
    return customer;
});
// PAY BACK FOR PRODUCT
const transferMoney = ({ amount, currency, destination, }) => __awaiter(void 0, void 0, void 0, function* () {
    const transfer = yield stripe.transfers.create({
        amount,
        currency,
        destination,
    });
    return transfer;
});
exports.transferMoney = transferMoney;
