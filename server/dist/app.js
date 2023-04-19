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
// DOTENV
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ASYNC ERRORS
require("express-async-errors");
// COOKIE PARSER
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// EXPRESS
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// DATABASE
const connectDB_1 = require("./connectDB/connectDB");
// ENV VARIABLES
const mongoUrl = process.env.MONGO_URL;
const port = Number(process.env.PORT) || 5000;
const jwtSecret = process.env.JWT_SECRET;
// ROUTES
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// ERRORS
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const notFoundError_1 = __importDefault(require("./middlewares/notFoundError"));
// MIDDLEWARES
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
// PAGES MIDDLEWARE
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/product", productRoutes_1.default);
app.use("/api/v1/review", reviewRoutes_1.default);
app.use("/api/v1/user", userRoutes_1.default);
// ERROR MIDDLEWARE
app.use(errorHandler_1.default);
app.use(notFoundError_1.default);
// START SERVER
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDB_1.connectDB)(mongoUrl);
        app.listen(port, () => console.log(`Server is listening on port: ${port}...`));
    }
    catch (error) {
        console.log(error);
        process.exit(0);
    }
});
start();
