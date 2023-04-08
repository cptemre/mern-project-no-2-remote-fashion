import { ObjectIdSchemaDefinition } from "mongoose";

interface TokenInterface {
  refreshToken: string;
  isValid: boolean;
  user: ObjectIdSchemaDefinition;
}

export default TokenInterface;
