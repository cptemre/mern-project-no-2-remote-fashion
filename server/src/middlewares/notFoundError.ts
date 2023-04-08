import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
const notFoundError: RequestHandler = (req, res) =>
  res.status(StatusCodes.NOT_FOUND).json({ msg: "Page not found" });

export default notFoundError;
