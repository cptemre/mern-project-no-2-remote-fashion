import { ObjectIdSchemaDefinition } from "mongoose";

interface TokenInterface {
  refreshToken: string;
  ip: string;
  userAgent: string;
  isValid: boolean;
  user: ObjectIdSchemaDefinition;
}

export default TokenInterface;
