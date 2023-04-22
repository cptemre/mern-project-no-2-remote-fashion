// INTERFACE
import { UserSchemaInterface } from "../utilities/interfaces/models";
import { RequestHandler } from "express";
// JWT
import { attachJwtToCookie, createHash, verifyToken } from "../utilities/token";
// ERRORS
import { UnauthorizedError } from "../errors";
// MODELS
import { Token } from "../models";
// MONGOOSE
import { ObjectId } from "mongoose";

// DECLARE A GLOBAL REQUEST KEY
declare global {
  namespace Express {
    interface Request {
      user?: UserSchemaInterface & { _id: ObjectId };
    }
  }
}

const authUser: RequestHandler = async (req, res, next) => {
  try {
    // GET TOKENS
    const {
      access_token,
      refresh_token,
    }: { access_token: string | undefined; refresh_token: string | undefined } =
      req.signedCookies;
    // IF ACCESS TOKEN THEN VERIFY IT AND ASSIGN TO REQ.USER
    if (access_token) {
      const isVerified = verifyToken(access_token);
      req.user = isVerified.user;
      next();
      return;
    }
    // IF ONLY REFRESH TOKEN
    if (refresh_token) {
      // VERIFY IT
      const isVerified = verifyToken(refresh_token);
      // GET EXISTING TOKEN FROM DB
      const existingToken = await Token.findOne({
        user: isVerified.user._id,
      });
      // GET USER IP AND AGENT INFO
      const ip = req.ip;
      const userAgent = req.headers["user-agent"];
      // COMPARE EXISTING TOKEN, IP AND AGENT
      if (
        !existingToken ||
        !existingToken.isValid ||
        isVerified.ip !== ip ||
        isVerified.userAgent !== userAgent
      )
        throw new UnauthorizedError("authorization failed");

      // CHECK IF VERIFY REFRESH TOKEN IS EQUAL TO EXISTING TOKEN
      if (isVerified.refreshToken !== existingToken?.refreshToken)
        throw new UnauthorizedError("authorization failed");

      attachJwtToCookie({
        res,
        user: isVerified.user,
        refreshToken: isVerified.refreshToken,
        ip,
        userAgent,
      });
      req.user = isVerified.user;
      next();
    } else {
      throw new UnauthorizedError("authorization failed");
    }
  } catch (error) {
    throw new UnauthorizedError("authorization failed");
  }
};

// CHECK IF THE PROVIDED ROLE FITS WITH THE REQ.USER TO ALLOW NEXT MIDDLEWARE
const authRole = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user || !req.user.userType || !roles.includes(req.user?.userType))
      throw new UnauthorizedError("access denied");
    // ELSE NEXT
    next();
  };
};

export { authUser, authRole };
