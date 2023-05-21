import { useContext } from "react";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
// FUNCTIONS
import sanitizeHTML from "../../../utilities/functions/sanitizeCurrencyEntity";
// INTERFACES
import AcceptableCurrencies from "./AcceptableCurrencies";
//* NPMS
import $ from "jquery";

const SelectedCurrency = () => {
  // STATE
  const { state } = useContext(Context);
  // MOUSE ENTER HANDLE
  const mouseEnterHandle = () => {
    // CHANGE THE COLOR OF SELECTED CURRENCY
    $("#selected-currency-article").css({
      backgroundColor: "var(--dark-orange-color-1)",
    });
    // SLIDE DOWN THE ACCEPTABLE CURRENCIES
    $("#acceptable-currencies-section").css({
      transform: "scaleY(1)",
    });
  };
  // MOUSE LEAVE HANDLE
  const mouseLeaveHandle = () => {
    // CHANGE THE COLOR OF SELECTED CURRENCY BACK TO INITIAL
    $("#selected-currency-article").css({
      backgroundColor: "var(--orange-color-1)",
    });
    // SLIDE UP THE ACCEPTABLE CURRENCIES
    $("#acceptable-currencies-section").css({
      transform: "scaleY(0)",
    });
  };

  return (
    <section
      id="selected-currency-section"
      onMouseEnter={() => mouseEnterHandle()}
      onMouseLeave={() => mouseLeaveHandle()}
    >
      <article
        id="selected-currency-article"
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML({
            state,
            selectedCurrency: state.payments.selectedCurrency,
          }),
        }}
      ></article>
      <AcceptableCurrencies />
    </section>
  );
};

export default SelectedCurrency;
