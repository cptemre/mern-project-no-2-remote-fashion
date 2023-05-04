import { BadRequestError } from "../../errors";

const limitAndSkip = ({ limit, page }: { limit: number; page: number }) => {
  let newPage = page || 1;
  if (newPage <= 0)
    throw new BadRequestError("page value can not be less than 1");
  const pageToSkip = newPage ? newPage - 1 : 0;
  const skip = limit * pageToSkip;
  return { limit, skip };
};

export default limitAndSkip;
