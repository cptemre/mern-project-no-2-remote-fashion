const recievedMsg = "order recieved";
const warehouseMsg = "packaging in the warehouse";
const deliveredToTheCargoCompanyMsg = "delivered to the cargo company";
const deliveredToTheCourierMsg = "delivered to the courier";
const deliveredToTheBuyerMsg = "delivered to the buyer";
const deliveredToTheSellerMsg = "delivered to the seller";

const sellerInformationArray = [
  recievedMsg,
  warehouseMsg,
  deliveredToTheCargoCompanyMsg,
];

const cargoInformationArray = [
  deliveredToTheCargoCompanyMsg,
  deliveredToTheCourierMsg,
  deliveredToTheBuyerMsg,
];

const cancelInformationArray = [
  deliveredToTheBuyerMsg,
  deliveredToTheCargoCompanyMsg,
  deliveredToTheCourierMsg,
  deliveredToTheSellerMsg,
];

const orderInformationArray = [
  ...sellerInformationArray,
  ...cargoInformationArray,
  ...cancelInformationArray,
];

export {
  sellerInformationArray,
  cargoInformationArray,
  orderInformationArray,
  recievedMsg,
};
