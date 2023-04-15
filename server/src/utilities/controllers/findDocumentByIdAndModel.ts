// MONGOOSE
import { Model, Document } from "mongoose";
// ERROR
import { BadRequestError } from "../../errors";
const findDocumentByIdAndModel = async <T extends Document>({
  id,
  user,
  MyModel,
}: {
  id: string;
  user?: string;
  MyModel: Model<T>;
}) => {
  // FIND THE PRODUCT
  const product = await MyModel.findOne({ _id: id, user });
  // IF PRODUCT DOES NOT EXIST SEND AN ERROR
  if (!product) throw new BadRequestError("document does not exist");

  return product;
};

export default findDocumentByIdAndModel;
