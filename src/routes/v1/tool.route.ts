import express, { Router } from "express";
import { toolController } from "../../modules/Tool";
// import { validate } from "../../modules/validate";
import { auth } from "../../modules/Auth";

const router: Router = express.Router();

router.route("/").post(
  // validate(toolValidation.createNewTool),
  auth.protect,
  auth.checkRoles("createTool"),
  toolController.uploadImage,
  toolController.createNewTool
);

export default router;
