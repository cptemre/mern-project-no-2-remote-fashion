import { ObjectId } from "mongoose";

const getUserTypeQuery = ({
  userType,
  id,
}: {
  userType: string;
  id: ObjectId;
}) => {
  // CHECK USER TYPE TO GET PROPER OBJECT
  const userTypeQuery: {
    user?: string;
    seller?: string;
    courier?: string;
  } = {};
  const stringId = id.toString();
  if (userType === "user") userTypeQuery.user = stringId;
  if (userType === "seller") userTypeQuery.seller = stringId;
  if (userType === "courier") userTypeQuery.courier = stringId;

  return { userTypeQuery };
};

export default getUserTypeQuery;
