import CustomError from "./CustomError";
import { StatusCodes } from "http-status-codes";

class ForbiddenError extends CustomError {
  private statusCode = StatusCodes.FORBIDDEN;
  public constructor(public message: string) {
    super(message);
  }
}

export default ForbiddenError;
