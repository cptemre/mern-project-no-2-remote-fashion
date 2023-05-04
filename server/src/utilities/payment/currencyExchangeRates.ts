import axios from "axios";

import { CurrencyExchangeInterface } from "../interfaces/payment";

const currencyExchangeRates = async ({
  from,
  to,
  amount,
}: CurrencyExchangeInterface) => {
  try {
    const headers = {
      apikey: process.env.FIXER_API_KEY as string,
    };
    const response = await axios.get("https://api.apilayer.com/fixer/convert", {
      headers,
      params: {
        to,
        from,
        amount: (amount / 100).toFixed(2),
      },
    });

    // THIS RETURNS THE CONVERTED VALUE OF NEW CURRENCY
    const exchangedValue: number = response.data.result;
    console.log("exchangedValue", exchangedValue);
    if (exchangedValue) return Number(exchangedValue.toFixed(2)) * 100;
  } catch (error) {
    console.error(error);
  }
};

export default currencyExchangeRates;
