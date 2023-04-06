import { UserSchemaInterface } from "./";
import { Response } from "express";

interface JwtInterface {
  res: Response;
  user: UserSchemaInterface;
  refreshToken: string;
}

interface CreateJwtPayload {
  payload: { user: UserSchemaInterface; refreshToken?: string };
}

export { JwtInterface, CreateJwtPayload };
