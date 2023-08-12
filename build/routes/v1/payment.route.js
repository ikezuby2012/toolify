"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Payment_1 = require("../../modules/Payment");
const Auth_1 = require("../../modules/Auth");
const router = express_1.default.Router();
router
    .route("/")
    .post(Auth_1.auth.protect, Payment_1.paymentController.PostPayment)
    .get(Payment_1.paymentController.getAllPayment);
router
    .route("/user")
    .get(Auth_1.auth.protect, Payment_1.paymentController.getUsersPaymentHistory);
router
    .route("/:id")
    .delete(Auth_1.auth.protect, Payment_1.paymentController.deletePaymentById)
    .get(Payment_1.paymentController.getPaymentById);
exports.default = router;
