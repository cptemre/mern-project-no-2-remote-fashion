// STRIPE
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

// SCHEMA FOR ARGS
import {
  CurrencyInterface,
  StripePaymentArgumentsSchema,
} from "../interfaces/payment";
import { UserSchemaInterface } from "../interfaces/models";

// MONGOOSE
import { ObjectId } from "mongoose";
const createPayment = async ({
  totalPrice,
  currency,
  cardNumber,
  expMonth,
  expYear,
  cvc,
  street,
  city,
  postalCode,
  country,
  state,
  user,
}: StripePaymentArgumentsSchema & {
  user: UserSchemaInterface & { _id: ObjectId };
}) => {
  try {
    // NAME OF THE CUSTOMER
    const name = user.name + " " + user.surname;
    // EMAIL OF THE USER
    const email = user.email;
    // PHONE OF THE USER
    const phone = user.phoneNumber
      ? user.phoneNumber?.countryCode + user.phoneNumber?.phoneNo
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
    const customer = await createOrGetCustomer({ name, email, phone, address });
    // * PAYMENT METHOD
    const paymentMethod: Stripe.PaymentMethod =
      await stripe.paymentMethods.create({
        card: {
          number: cardNumber,
          exp_month: expMonth,
          exp_year: expYear,
          cvc,
        },
        billing_details: {
          name: "John Doe",
          email: "john.doe@example.com",
          address,
        },
      });
    // * PAYMENT INTENT TO GET ID & SECRET IN CONTROLLER TO ADD IT TO THE ORDER MODEL
    const paymentIntent = createPaymentIntent({
      totalPrice,
      currency,
      paymentMethodId: paymentMethod.id,
      customerId: customer.id,
    });
    return paymentIntent;
  } catch (error) {
    console.error(error);
  }
};

const transferMoney = async ({
  amount,
  currency,
  destination,
}: {
  amount: number;
  currency: string;
  destination: string;
}) => {
  const transfer = await stripe.transfers.create({
    amount,
    currency,
    destination,
  });

  return transfer;
};

// * PAYMENT INTENT TO GET ID & SECRET IN CONTROLLER TO ADD IT TO THE ORDER MODEL
const createPaymentIntent = async ({
  totalPrice,
  currency,
  paymentMethodId,
  customerId,
}: {
  totalPrice: number;
  currency: string;
  paymentMethodId: string;
  customerId: string;
}) => {
  // PAYMENT IS CONFIRMED DIRECTLY FOR TESTING
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: totalPrice,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      payment_method_types: ["card"],
      payment_method: paymentMethodId,
      return_url: process.env.CLIENT_ADDRESS + "/payment-verified",
      customer: customerId,
      confirm: true,
    });
  return paymentIntent;
};

const createOrGetCustomer = async ({
  name,
  email,
  phone,
  address,
}: {
  name: string;
  email: string;
  phone: string;
  address: object;
}) => {
  let customer: Stripe.Customer;
  // Check if the customer already exists
  const existingCustomer = await stripe.customers.list({
    email,
    limit: 1,
  });
  if (existingCustomer.data.length > 0) {
    // Retrieve the existing customer
    customer = existingCustomer.data[0];
  } else {
    // Create a new customer
    customer = await stripe.customers.create({
      name,
      email,
      phone,
      address,
    });
  }
  return customer;
};

export default createPayment;
