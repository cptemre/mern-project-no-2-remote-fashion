// STRIPE
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51MpbFZLI8qA1IP9XKA3aSXeHWooAsUf6lI4yHwOd1ktLbr00pmbNN3H5UKLDNyzQB4WAp1kmmDWLtRoSOxzjzoaK005Glaqe05",
  {
    apiVersion: "2022-11-15",
  }
);

// SCHEMA FOR ARGS
import { StripePaymentArgumentsSchema } from "../interfaces/payment";

const createPayment = async ({
  totalPrice,
  currency,
}: StripePaymentArgumentsSchema) => {
  try {
    // PAYMENT INTENT TO GET ID & SECRET IN CONTROLLER TO ADD IT TO THE ORDER MODEL
    const paymentIntent: Stripe.PaymentIntent =
      await stripe.paymentIntents.create({
        amount: totalPrice,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });
    return paymentIntent;
  } catch (error) {
    console.error(error);
  }
};

export default createPayment;
