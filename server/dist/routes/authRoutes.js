"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authController_1 = require("../controls/authController");
router.route("/register").post(authController_1.registerUser);
router.route("/verify-email").post(authController_1.verifyEmail);
router.route("/login").post(authController_1.login);
router.route("/forgot-password").post(authController_1.forgotPassword);
router.route("/reset-password").post(authController_1.resetPassword);
router.route("/logout").get(authController_1.logout);
exports.default = router;
