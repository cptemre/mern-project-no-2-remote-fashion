import CustomError from "./CustomError";
import { StatusCodes } from "http-status-codes";

class PaymentRequiredError extends CustomError {
  private statusCode = StatusCodes.PAYMENT_REQUIRED;
  constructor(public message: string) {
    super(message);
  }
}

export default PaymentRequiredError;
