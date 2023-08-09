"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Cart_1 = require("../../modules/Cart");
const Auth_1 = require("../../modules/Auth");
const router = express_1.default.Router();
router.route("/").post(Auth_1.auth.protect, Cart_1.cartController.BorrowTool);
router.route("/user").get(Auth_1.auth.protect, Cart_1.cartController.getUserBorrowedTools);
exports.default = router;
