import express, { Router } from "express";
import { cartController } from "../../modules/Cart";
import { auth } from "../../modules/Auth";

const router: Router = express.Router();

router.route("/").post(auth.protect, cartController.BorrowTool);
router.route("/user").get(auth.protect, cartController.getUserBorrowedTools);
router
  .route("/:id")
  .delete(auth.protect, cartController.RemoveTool)
  .get(cartController.getBorrowedToolById);

export default router;
