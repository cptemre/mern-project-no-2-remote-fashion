import { ObjectId } from "mongoose";
// ERRORS
import { UnauthorizedError } from "../../errors";
// ! PARAMS CHANGED - THERE MAY BE PROBLEMS
const userIdAndModelUserIdMatchCheck = ({
  userType,
  userId,
  reqUserId,
}: {
  // ! CREATE AN INTERFACE FOR THE ID
  userType: string;
  userId: string | ObjectId;
  reqUserId: string | ObjectId;
}) => {
  if (!userType || !userId || !reqUserId)
    throw new UnauthorizedError("access denied");
  const userIdString = userId.toString();
  const reqUserIdString = reqUserId.toString();
  if (userType === "user" && userIdString !== reqUserIdString)
    throw new UnauthorizedError("user id does not match");
  if (userType === "seller" && userIdString !== reqUserIdString)
    throw new UnauthorizedError("seller id does not match");
  else return;
};

export default userIdAndModelUserIdMatchCheck;
