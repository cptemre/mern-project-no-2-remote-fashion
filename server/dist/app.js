"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// NPMS
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("express-async-errors");
// EXPRESS
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// DATABASE
const connectDB_1 = require("./connectDB/connectDB");
// ENV VARIABLES
const mongo_url = process.env.MONGO_URL;
const port = Number(process.env.PORT) || 5000;
// ROUTES
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// MIDDLEWARES
app.use(express_1.default.json());
// PAGES
app.use("/api/v1/auth", authRoutes_1.default);
// START SERVER
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDB_1.connectDB)(mongo_url);
        app.listen(port, () => console.log(`Server is listening on port: ${port}...`));
    }
    catch (error) {
        console.log(error);
        process.exit(0);
    }
});
start();
