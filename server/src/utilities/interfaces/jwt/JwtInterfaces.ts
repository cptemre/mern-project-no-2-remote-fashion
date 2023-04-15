import { UserSchemaInterface } from "..";
import { Response } from "express";

interface JwtInterface {
  res: Response;
  user: UserSchemaInterface;
  refreshToken: string;
  ip: string;
  userAgent?: string;
}
interface CreateJwtPayloadObject {
  user: UserSchemaInterface;
  refreshToken?: string;
  ip?: string;
  userAgent?: string;
}
interface CreateJwtPayload {
  payload: CreateJwtPayloadObject;
}

export { JwtInterface, CreateJwtPayload, CreateJwtPayloadObject };
