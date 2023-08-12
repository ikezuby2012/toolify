import express, { Router } from "express";
import { paymentController } from "../../modules/Payment";
import { auth } from "../../modules/Auth";

const router: Router = express.Router();

router
  .route("/")
  .post(auth.protect, paymentController.PostPayment)
  .get(paymentController.getAllPayment);
router
  .route("/user")
  .get(auth.protect, paymentController.getUsersPaymentHistory);
router
  .route("/:id")
  .delete(auth.protect, paymentController.deletePaymentById)
  .get(paymentController.getPaymentById);

export default router;
