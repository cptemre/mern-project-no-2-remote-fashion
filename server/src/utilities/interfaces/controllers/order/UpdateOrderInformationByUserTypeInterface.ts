import { OrderStatusInterface } from "../../models";

interface UpdateOrderInformationByUserTypeInterface {
  orderInformation: string;
  singleOrderInformationValue: string;
  informationArray: string[];
  status: OrderStatusInterface["status"];
}

export default UpdateOrderInformationByUserTypeInterface;
