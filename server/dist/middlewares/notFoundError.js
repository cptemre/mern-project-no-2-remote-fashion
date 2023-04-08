"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const notFoundError = (req, res) => res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ msg: "Page not found" });
exports.default = notFoundError;
