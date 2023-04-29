import axios from "axios";

const currencyExchangeRates = async ({
  from,
  to,
  amount,
}: {
  from: string;
  to: string;
  amount: number;
}) => {
  try {
    const headers = {
      apikey: process.env.FIXER_API_KEY as string,
    };
    const response = await axios.get("https://api.apilayer.com/fixer/convert", {
      headers,
      params: {
        to: to.toUpperCase(),
        from: from.toUpperCase(),
        amount,
      },
    });

    // THIS RETURNS THE CONVERTED VALUE OF NEW CURRENCY
    const exchangedValue: number = response.data.result;
    console.log(exchangedValue);
    if (exchangedValue) return exchangedValue;
  } catch (error) {
    console.error(error);
  }
};

export default currencyExchangeRates;
