"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
require("mongoose");
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = (MONGO_URL) => {
    mongoose_1.default.set("strictQuery", true);
    console.log("Database connected.");
    return mongoose_1.default.connect(MONGO_URL);
};
exports.connectDB = connectDB;
