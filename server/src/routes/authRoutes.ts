import express from "express";
const router = express.Router();

import { registerUser, verifyEmail, login } from "../controls/authController";

router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(login);

export default router;
