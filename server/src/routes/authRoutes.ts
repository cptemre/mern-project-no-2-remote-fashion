import express from "express";
const router = express.Router();

import {
  registerUser,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  logout,
} from "../controls/authController";

import { authUser } from "../middlewares/authorization";

router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/logout").delete(authUser, logout);

export default router;
