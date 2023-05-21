import { useContext } from "react";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
// FUNCTIONS
import sanitizeHTML from "../../../utilities/functions/sanitizeCurrencyEntity";
//* CSS
import "../../../css/header/currency/currency.css";
import { AcceptableCurrinciesInterface } from "../../../utilities/interfaces/payment/paymentInterfaces";
const Currency = () => {
  // STATE
  const { state } = useContext(Context);
  return (
    <section id="currency-section">
      <section id="currency-position-section">
        <article
          id="selected-currency-article"
          dangerouslySetInnerHTML={{
            __html: sanitizeHTML({
              state,
              selectedCurrency: state.payments.selectedCurrency,
            }),
          }}
        ></article>
        <article
          id="acceptable-currencies-section"
          className="currency-article"
        >
          {Object.keys(state.payments.acceptableCurrencies).map(
            (acceptableCurrency, i) => {
              if (state.payments.selectedCurrency !== acceptableCurrency) {
                let counter = i;
                // KEYS AS AN ARRAY
                const acceptableCurrenciesKeys = Object.keys(
                  state.payments.acceptableCurrencies
                );
                // FILTER THE SELECTED CURRENCY AND DECREASE THE COUNTER BY ONE
                const filteredAcceptableCurrenciesKey =
                  acceptableCurrenciesKeys.filter((key) => {
                    if (key === state.payments.selectedCurrency) counter--;
                    return key !== state.payments.selectedCurrency;
                  });
                // GET THE CURRECY KEY
                const selectedCurrency = filteredAcceptableCurrenciesKey[
                  counter
                ] as keyof AcceptableCurrinciesInterface;
                return (
                  <div
                    key={`currency-div-${counter}`}
                    className="currency-div"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML({
                        state,
                        selectedCurrency,
                      }),
                    }}
                  ></div>
                );
              }
            }
          )}
        </article>
      </section>
    </section>
  );
};

export default Currency;
