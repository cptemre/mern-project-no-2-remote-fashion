import { BadRequestError } from "../../errors";
import { CreditCardInformationInterface } from "../interfaces/models";

const cardInfoSplitter = ({ card }: { card: string }) => {
  // SPLIT THE CARD QUERY TO "cardNumber", "expMonth", "expYear", "cvc" AND ITS VALUES AS AN ARRAY
  // EXAMPLE: ['cvc=000',......]
  const cardInfos = card.split("_");
  // ARRAY INSIDE ARRAY
  // EXAMPLE AFTER LOOP [['cvc','000'],......]
  let splittedInfos: string[][] = [];
  for (let i = 0; i < cardInfos.length; i++)
    splittedInfos = [...splittedInfos, splitCardInfos(cardInfos[i])];
  // KEY VALUE OBJECT FOR CARD INFO KEY IN USER MODEL
  const cardInfo: CreditCardInformationInterface = {
    cardNumber: "",
    expMonth: undefined,
    expYear: undefined,
    cvc: "",
  };
  for (let i = 0; i < splittedInfos.length; i++) {
    const [key, value] = splittedInfos[i];
    cardInfo[key] = value;
  }
  const { cardNumber, expMonth, expYear, cvc } = cardInfo;
  if (cardNumber && expMonth && expYear && cvc) return cardInfo;
  else
    throw new BadRequestError(
      "card information values are not provided correctly"
    );
};

const splitCardInfos = (info: string) => {
  const cardInfokeys = ["cardNumber", "expMonth", "expYear", "cvc"];
  const splittedInfo = info.split("-");
  if (!cardInfokeys.includes(splittedInfo[0]))
    throw new BadRequestError("card info is wrong");
  return splittedInfo;
};

export default cardInfoSplitter;
