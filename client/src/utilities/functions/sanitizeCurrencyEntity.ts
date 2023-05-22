//* UTILITIES
// INTERFACES
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";
import { AcceptableCurrinciesInterface } from "../interfaces/payment/paymentInterfaces";
//* NPMS
import DOMpurify from "dompurify";

const sanitizeHTML = ({
  selectedEntity,
}: {
  selectedEntity: AcceptableCurrinciesInterface[keyof AcceptableCurrinciesInterface];
}) => {
  // SANITIZE IT TO AVOID DANGEROUS ATTACKS
  const sanitizedSelectedEntity = DOMpurify.sanitize(selectedEntity);
  // RETURN THE ENTITY
  return sanitizedSelectedEntity;
};

export default sanitizeHTML;
