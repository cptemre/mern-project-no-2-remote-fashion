// INTERFACE
import { UserSchemaInterface } from "../utilities/interfaces";
import { RequestHandler } from "express";
// JWT
import { attachJwtToCookie, createHash, verifyToken } from "../utilities/token";
// ERRORS
import { UnauthorizedError } from "../errors";
// MODELS
import { Token } from "../models";
// MONGOOSE
import { Types } from "mongoose";
// BCRYPTJS
import bcrypt from "bcryptjs";
declare global {
  namespace Express {
    interface Request {
      user?: UserSchemaInterface & { userId: Types.ObjectId };
    }
  }
}
const authUser: RequestHandler = async (req, res, next) => {
  try {
    const {
      access_token,
      refresh_token,
    }: { access_token: string | undefined; refresh_token: string | undefined } =
      req.signedCookies;

    if (access_token) {
      const isVerified = verifyToken(access_token);
      req.user = isVerified.user;
      next();
      return;
    }
    if (refresh_token) {
      const isVerified = verifyToken(refresh_token);

      const existingToken = await Token.findOne({
        user: isVerified.user._id,
      });

      const ip = req.ip;
      const userAgent = req.headers["user-agent"];

      if (
        !existingToken ||
        !existingToken.isValid

        // isVerified.ip !== ip
        // // isVerified.userAgent !== userAgent
      )
        throw new UnauthorizedError("access denied");

      const isTokenCorrect = await bcrypt.compare(
        isVerified.refreshToken,
        existingToken?.refreshToken
      );

      if (!isTokenCorrect) throw new UnauthorizedError("access denied");

      attachJwtToCookie({
        res,
        user: isVerified.user,
        refreshToken: refresh_token,
        ip,
        userAgent,
      });
      req.user = isVerified.user;
      next();
    } else {
      throw new UnauthorizedError("access denied");
    }
  } catch (error) {
    console.log(error);

    throw new UnauthorizedError("access denied");
  }
};

// ! ADD AUTHORIZATION TO CHECK USER ROLE

export { authUser };
