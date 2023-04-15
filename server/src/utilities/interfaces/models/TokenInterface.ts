import { ObjectId, Document } from "mongoose";

interface TokenInterface extends Document {
  refreshToken: string;
  isValid: boolean;
  user: ObjectId;
}

export default TokenInterface;
