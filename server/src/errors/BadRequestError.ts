import CustomError from "./CustomError";
import { StatusCodes } from "http-status-codes";

class BadRequestError extends CustomError {
  private statusCode = StatusCodes.BAD_REQUEST;
  public constructor(public message: string) {
    super(message);
  }
}

export default BadRequestError;
