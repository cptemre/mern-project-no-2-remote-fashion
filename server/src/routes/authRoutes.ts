import express from "express";
const router = express.Router();

import {
  registerUser,
  verifyEmail,
  login,
  forgotPassword,
} from "../controls/authController";

router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").delete(login);
router.route("/forgot-password").post(forgotPassword);

export default router;
