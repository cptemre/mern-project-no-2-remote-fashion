import CustomError from "./CustomError";
import { StatusCodes } from "http-status-codes";

class ConflictError extends CustomError {
  private statusCode = StatusCodes.CONFLICT;
  public constructor(public message: string) {
    super(message);
  }
}

export default ConflictError;
