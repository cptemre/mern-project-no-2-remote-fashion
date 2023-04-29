import { BadRequestError } from "../../errors";

const cardInfoSplitter = ({ card }: { card: string }) => {
  // SPLIT THE CARD QUERY TO "cardNumber", "expMonth", "expDate", "cvc" AND ITS VALUES AS AN ARRAY
  // EXAMPLE: ['cvc=000',......]
  const cardInfos = card.split("_");
  // ARRAY INSIDE ARRAY
  // EXAMPLE AFTER LOOP [['cvc','000'],......]
  let splittedInfos: string[][] = [];
  for (let i = 0; i < cardInfos.length; i++)
    splittedInfos = [...splittedInfos, splitCardInfos(cardInfos[i])];
  // KEY VALUE OBJECT FOR CARD INFO KEY IN USER MODEL
  const cardInfo: { [key: string]: string } = {};
  for (let i = 0; i < splittedInfos.length; i++) {
    const [key, value] = splittedInfos[i];
    cardInfo[key] = value;
  }

  return { cardInfo };
};

const splitCardInfos = (info: string) => {
  const cardInfokeys = ["cardNumber", "expMonth", "expDate", "cvc"];
  const splittedInfo = info.split("-");
  if (!cardInfokeys.includes(splittedInfo[0]))
    throw new BadRequestError("card info is wrong");
  return splittedInfo;
};

export default cardInfoSplitter;
