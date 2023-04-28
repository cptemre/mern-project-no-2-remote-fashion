import axios from "axios";

const currencyExchangeRates = async () => {
  try {
    const baseCurrency = "GBP";
    const toCurrency = "EUR";
    const amount = 2000;
    const headers = {
      apikey: process.env.FIXER_API_KEY as string,
    };
    const response = await axios.get("https://api.apilayer.com/fixer/convert", {
      headers: headers,
      params: {
        to: toCurrency,
        from: baseCurrency,
        amount: amount,
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export default currencyExchangeRates;
