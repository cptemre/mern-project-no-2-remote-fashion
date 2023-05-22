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
  const { state, dispatch } = useContext(Context);

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
  // MOUSE UP HANDLE
  const mouseUpHandle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clickedCurrency = $(e.currentTarget).attr("data-currency");
    dispatch({ type: "SELECTED_CURRENCY", payload: clickedCurrency });
  };
  return (
    <article id="acceptable-currencies-section" className="currency-article">
      {Object.keys(state.payments.acceptableCurrencies).map(
        (acceptableCurrency, i) => {
          if (state.payments.selectedCurrency !== acceptableCurrency) {
            const selectedEntity =
              state.payments.acceptableCurrencies[
                acceptableCurrency as keyof AcceptableCurrinciesInterface
              ];
            return (
              <div
                key={`currency-div-${i}`}
                className="currency-div"
                data-currency={acceptableCurrency}
                data-entity={selectedEntity}
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML({
                    selectedEntity,
                  }),
                }}
                onMouseEnter={(e) => mouseEnterHandle(e)}
                onMouseLeave={(e) => mouseLeaveHandle(e)}
                onMouseUp={(e) => mouseUpHandle(e)}
              ></div>
            );
          }
        }
      )}
    </article>
  );
};

export default AcceptableCurrencies;
