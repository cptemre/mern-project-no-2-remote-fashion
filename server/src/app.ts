// DOTENV
import dotenv from "dotenv";
dotenv.config();
// ENV VARIABLES
const mongoUrl = process.env.MONGO_URL as string;
const port = Number(process.env.PORT) || 5000;
const jwtSecret = process.env.JWT_SECRET as string;
// ASYNC ERRORS
import "express-async-errors";
// COOKIE PARSER
import cookieParser from "cookie-parser";
// EXPRESS
import express from "express";
const app = express();
// MULTER
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });
// DATABASE
import { connectDB } from "./connectDB/connectDB";

// ROUTES
import authRouter from "./routes/authRoutes";
import productRouter from "./routes/productRoutes";
import reviewRouter from "./routes/reviewRoutes";
import userRouter from "./routes/userRoutes";
import orderRouter from "./routes/orderRoutes";
import imageRouter from "./routes/imageRoutes";
// ERRORS
import errorHandler from "./middlewares/errorHandler";
import notFoundError from "./middlewares/notFoundError";

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser(jwtSecret));
// PAGES MIDDLEWARE
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/upload/image", upload.array("images", 5), imageRouter);
// ERROR MIDDLEWARE
app.use(errorHandler);
app.use(notFoundError);
// START SERVER
const start = async () => {
  try {
    await connectDB(mongoUrl);
    app.listen(port, () =>
      console.log(`Server is listening on port: ${port}...`)
    );
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};

start();
