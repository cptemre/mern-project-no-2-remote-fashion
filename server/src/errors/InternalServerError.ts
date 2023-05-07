import CustomError from "./CustomError";
import { StatusCodes } from "http-status-codes";

class InternalServerError extends CustomError {
  private statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  public constructor(public message: string) {
    super(message);
  }
}

export default InternalServerError;
