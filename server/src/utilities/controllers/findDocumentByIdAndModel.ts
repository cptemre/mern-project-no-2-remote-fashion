// MONGOOSE
import { Model, Document, ObjectId } from "mongoose";
// ERROR
import { BadRequestError } from "../../errors";
const findDocumentByIdAndModel = async <T extends Document>({
  id,
  user,
  seller,
  courier,
  MyModel,
}: {
  id: string | ObjectId;
  user?: string | ObjectId;
  seller?: string | ObjectId;
  courier?: string | ObjectId;
  MyModel: Model<T>;
}) => {
  // QUERY FOR FINDING THE DOCUMENT
  const query: {
    _id?: string;
    user?: string;
    seller?: string;
    courier?: string;
  } = {};
  if (id) query._id = id.toString();
  if (user) query.user = user.toString();
  if (seller) query.seller = seller.toString();
  if (courier) query.courier = courier.toString();

  // FIND THE DOCUMENT
  const document = await MyModel.findOne(query);
  // IF DOCUMENT DOES NOT EXIST SEND AN ERROR
  if (!document) throw new BadRequestError("document does not exist");

  return document;
};

export default findDocumentByIdAndModel;
