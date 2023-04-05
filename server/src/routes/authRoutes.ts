import express from "express";
const router = express.Router();

import { registerUser } from "../controls/authController";

router.route("/register").post(registerUser);

export default router;
