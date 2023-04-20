// STRIPE
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51MpbFZLI8qA1IP9XKA3aSXeHWooAsUf6lI4yHwOd1ktLbr00pmbNN3H5UKLDNyzQB4WAp1kmmDWLtRoSOxzjzoaK005Glaqe05",
  {
    apiVersion: "2022-11-15",
  }
);

// SCHEMA FOR ARGS
import { StripePaymentArgumentsSchema } from "../interfaces/index";

const createPayment = async ({
  name,
  email,
  phone,
  unit_amount,
  currency,
  productId,
  street: line1,
  city,
  postalCode,
  country,
}: StripePaymentArgumentsSchema) => {
  try {
    // CREATE CUSTOMER
    const customer: Stripe.Customer = await stripe.customers.create({
      name,
      email,
      phone,
      address: { city, country, line1, postal_code: postalCode.toString() },
    });
    // CREATE PRODUCT
    const product: Stripe.Product = await stripe.products.create({
      name: "Online Fashion",
      description: "Online fashion order payment",
    });
    // CREATE PRICE
    const price: Stripe.Price = await stripe.prices.create({
      unit_amount,
      currency,
      product: productId as string,
    });
    // PAYMENT INTENT TO GET ID IN CONTROLLER TO ADD IT TO THE ORDER MODEL
    const paymentIntent: Stripe.PaymentIntent =
      await stripe.paymentIntents.create({
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
  } catch (error) {
    console.error(error);
  }
};

export default createPayment;
