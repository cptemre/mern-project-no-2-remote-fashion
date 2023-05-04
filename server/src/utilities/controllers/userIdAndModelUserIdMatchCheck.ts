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
  const reqUserId = user?._id.toString();
  if (user?.userType === "user" && userId !== reqUserId)
    throw new UnauthorizedError("user id does not match");
  if (user?.userType === "seller" && userId !== reqUserId)
    throw new UnauthorizedError("seller id does not match");
  else return;
};

export default userIdAndModelUserIdMatchCheck;
