import { BadRequestError } from "../../errors";
import { CurrencyExchangeInterface } from "../interfaces/payment";
import currencyExchangeRates from "../payment/currencyExchangeRates";
import findDocumentByIdAndModel from "./findDocumentByIdAndModel";
import { CurrencyInterface } from "../interfaces/payment";
import { Model } from "mongoose";
import { ProductSchemaInterface } from "../interfaces/models";

const priceAndExchangedPriceCompare = async ({
  price,
  tax,
  productId,
  currency,
  Product,
}: {
  price: number;
  tax: number;
  productId: string;
  currency: string;
  Product: Model<ProductSchemaInterface>;
}) => {
  if (!price || !tax || !productId || !currency || !Product)
    throw new BadRequestError("invalid credientals");

  let exchangedPrice = price;
  // FIND THE DOCUMENT OF PRODUCT
  const product = await findDocumentByIdAndModel({
    id: productId as string,
    MyModel: Product,
  });
  // IF CURRENCY IS ANOTHER THAN gbp GET EXCHANGE VALUE
  if (currency.toUpperCase() !== "GBP") {
    // CURRENCY CHANGE TO GBP
    const exchangedValue = await currencyExchangeRates({
      from: "GBP",
      to: currency.toUpperCase() as CurrencyExchangeInterface["to"],
      amount: product.price,
    });
    // IF THERE IS A NUMBER VALUE THEN SET IT EQUAL TO SUBTOTAL
    // FROM NOW ON IN THIS CONTROLLER VALUES ARE IN GBP CURRENCY
    if (exchangedValue) exchangedPrice = exchangedValue;
  }
  if (price !== exchangedPrice)
    throw new BadRequestError("requested price is not correct");
  if (tax !== product.tax)
    throw new BadRequestError("requested tax is not correct");
  return;
};

export default priceAndExchangedPriceCompare;
