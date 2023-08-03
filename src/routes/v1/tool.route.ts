import express, { Router } from "express";
import { toolController, toolValidation } from "../../modules/Tool";
import { validate } from "../../modules/validate";
import { auth } from "../../modules/Auth";

const router: Router = express.Router();

router
  .route("/")
  .post(
    validate(toolValidation.createNewTool),
    auth.protect,
    auth.checkRoles("createTool"),
    toolController.createNewTool
  );

export default router;
