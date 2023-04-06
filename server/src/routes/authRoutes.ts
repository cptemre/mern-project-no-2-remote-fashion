import express from "express";
const router = express.Router();

import {
  registerUser,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
} from "../controls/authController";

router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

export default router;
