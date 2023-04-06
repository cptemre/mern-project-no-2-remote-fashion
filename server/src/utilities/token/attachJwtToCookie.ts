import jwt from "jsonwebtoken";
import { CreateJwtPayload, JwtInterface } from "../interfaces";

const createJWT = ({ payload }: CreateJwtPayload) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const token = jwt.sign(payload, jwtSecret);
  return token;
};

const attachJwtToCookie = ({ res, user, refreshToken }: JwtInterface) => {
  const payload = { user, refreshToken };
  const status = process.env.STATUS as string;
  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = oneDay * 30;
  const access_token = createJWT(<CreateJwtPayload>{ payload });
  const refresh_token = createJWT(<CreateJwtPayload>{ payload });

  res.cookie(access_token, "access_token", {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    signed: true,
    secure: status === "production",
  });
  res.cookie(refresh_token, "refresh_token", {
    httpOnly: true,
    expires: new Date(Date.now() + oneMonth),
    signed: true,
    secure: status === "production",
  });
};

export default attachJwtToCookie;
