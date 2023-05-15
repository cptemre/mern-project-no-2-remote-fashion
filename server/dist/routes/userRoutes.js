"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controllers/userController");
const authorization_1 = require("../middlewares/authorization");
router.route("/").get(authorization_1.authUser, (0, authorization_1.authRole)("admin"), userController_1.getAllUsers);
router.route("/show-current-user").get(authorization_1.authUser, userController_1.showCurrentUser);
router
    .route("/:id")
    .get(authorization_1.authUser, (0, authorization_1.authRole)("admin"), userController_1.getSingleUser)
    .patch(authorization_1.authUser, (0, authorization_1.authRole)("admin", "user"), userController_1.updateUser)
    .delete(authorization_1.authUser, (0, authorization_1.authRole)("admin", "user"), userController_1.deleteUser);
exports.default = router;
