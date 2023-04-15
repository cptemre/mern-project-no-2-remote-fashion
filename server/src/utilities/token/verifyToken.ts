import jwt from "jsonwebtoken";
// ERROR
import { UnauthorizedError } from "../../errors";
const verifyToken = (token: string) => {
  const isVerified = jwt.verify(token, process.env.JWT_SECRET as string);

  if (typeof isVerified === "string")
    throw new UnauthorizedError("access denied");

  return isVerified;
};

export default verifyToken;
