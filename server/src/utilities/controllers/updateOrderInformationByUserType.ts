import { BadRequestError } from "../../errors";
import { UpdateOrderInformationByUserTypeInterface } from "../interfaces/controllers";
import { orderStatusValues } from "../categories";
import { OrderStatusInterface } from "../interfaces/models";

const updateOrderInformationByUserType = ({
  orderInformation,
  singleOrderInformationValue,
  informationArray,
  status,
}: UpdateOrderInformationByUserTypeInterface) => {
  // CHECK IF ORDER INFORMATION VALUE IS VALID VALUE
  if (!informationArray.includes(orderInformation))
    throw new BadRequestError(
      `${orderInformation} is not accepted as an information`
    );
  // GET THE INDEX VALUE OF ACTUAL ORDER INFORMATION IN SINGLE ORDER DOCUMENT
  const indexOfSingleOrderInformationValue = informationArray.indexOf(
    singleOrderInformationValue
  );
  // GET THE INDEX ORDER OF CLIENT SIDE ORDER INFORMATION
  const indexOfClientOrderInformation =
    informationArray.indexOf(orderInformation);
  // COMPARE TWO INDEXES AND IF NEW VALUE INDEX IS NOT FOLLOWING THE PREVIOUS ONE THEN THROW A NEW ERROR
  if (indexOfSingleOrderInformationValue + 1 !== indexOfClientOrderInformation)
    throw new BadRequestError("information order is not correct");

  // * STATUS CHECK BEGINS
  // IF IT IS NOT THE LAST MESSAGE IN THE ARRAY THEN RETURN THE SAME STATUS
  if (
    informationArray[indexOfClientOrderInformation] !==
    informationArray[informationArray.length - 1]
  )
    return { status };
  // IF IT IS LAST MESSAGE IN THE ARRAY AND IF THE STATUS IS NOT CANCELED THEN RETURN THE NEXT STATUS FROM THE ORDER STATUS VALUES ARRAY
  if (status !== "canceled") {
    // GET THE INDEX OF CURRENT STATUS FROM THE ORDER STATUS VALUES ARRAY
    const indexOfStatus = orderStatusValues.indexOf(status);
    // GET THE NEW STATUS BY ADDING THE INDEX +1
    const newStatus = orderStatusValues[
      indexOfStatus + 1
    ] as OrderStatusInterface["status"];
    console.log(newStatus);

    // IF THERE IS NO SUCH STATUS THEN THROW AN ERROR
    if (!newStatus) throw new BadRequestError("status is not correct");

    // IF NEW STATUS IS DELIVERED
    const deliveredToUser = newStatus === "delivered";
    const deliveryDate = newStatus === "delivered" && new Date(Date.now());
    // IF NEW STATUS IS CANCELED
    const canceled = newStatus === "canceled";
    const cancelationDate = newStatus === "canceled" && new Date(Date.now());
    // RETURN NEW STATUS
    return {
      status: newStatus,
      deliveredToUser,
      deliveryDate,
      canceled,
      cancelationDate,
    };
  }
  // IF CANCELED THEN RETURN THE SAME STATUS
  return { status };
};

export default updateOrderInformationByUserType;
