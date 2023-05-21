//* UTILITIES
// INTERFACES
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";
import { AcceptableCurrinciesInterface } from "../interfaces/payment/paymentInterfaces";
//* NPMS
import DOMpurify from "dompurify";

const sanitizeHTML = ({
  state,
  selectedCurrency,
}: {
  state: InitialStateInterface;
  selectedCurrency: keyof AcceptableCurrinciesInterface;
}) => {
  // GET SELECTED ENTITY
  const selectedEntity = state.payments.acceptableCurrencies[selectedCurrency];
  // SANITIZE IT TO AVOID DANGEROUS ATTACKS
  const sanitizedSelectedEntity = DOMpurify.sanitize(selectedEntity);
  // RETURN THE ENTITY
  return sanitizedSelectedEntity;
};

export default sanitizeHTML;
