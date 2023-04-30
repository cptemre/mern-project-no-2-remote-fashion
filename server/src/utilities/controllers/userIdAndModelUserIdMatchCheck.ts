// EXPRESS
import { UserSchemaInterface } from "../interfaces/models";
// ERRORS
import { UnauthorizedError } from "../../errors";
// MONGOOSE
import { ObjectId } from "mongoose";
const userIdAndModelUserIdMatchCheck = ({
  user,
  userId,
}: {
  // ! CREATE AN INTERFACE FOR THE ID
  user: UserSchemaInterface & { _id: ObjectId };
  userId: string;
}) => {
  if (user?.userType !== "admin" && userId !== user?._id)
    throw new UnauthorizedError("authorization failed");
  else return;
};

export default userIdAndModelUserIdMatchCheck;
