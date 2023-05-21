import { useContext } from "react";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
// FUNCTIONS
import sanitizeHTML from "../../../utilities/functions/sanitizeCurrencyEntity";
// INTERFACES
import { AcceptableCurrinciesInterface } from "../../../utilities/interfaces/payment/paymentInterfaces";
//* NPMS
import $ from "jquery";
const AcceptableCurrencies = () => {
  // STATE
  const { state } = useContext(Context);
  // CURRENCY MOUSE ENTER HANDLE
  const mouseEnterHandle = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // SET MOUSE ENTERED CURRENCY COLOR
    $(e.currentTarget).css({
      backgroundColor: "var(--orange-color-4)",
    });
  };
  // CURRENCY MOUSE LEAVE HANDLE
  const mouseLeaveHandle = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // SET MOUSE LEFT CURRENCY COLOR TO INITIAL
    $(e.currentTarget).css({
      backgroundColor: "var(--orange-color-1)",
    });
  };
  return (
    <article id="acceptable-currencies-section" className="currency-article">
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
                onMouseEnter={(e) => mouseEnterHandle(e)}
                onMouseLeave={(e) => mouseLeaveHandle(e)}
              ></div>
            );
          }
        }
      )}
    </article>
  );
};

export default AcceptableCurrencies;
