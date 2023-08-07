import express, { Router } from "express";
import { toolController } from "../../modules/Tool";
// import { validate } from "../../modules/validate";
import { auth } from "../../modules/Auth";

const router: Router = express.Router();

router
  .route("/")
  .post(
    // validate(toolValidation.createNewTool),
    auth.protect,
    auth.checkRoles("createTool"),
    toolController.uploadImage,
    toolController.createNewTool
  )
  .get(toolController.getAllTools);

router.route("/user").get(auth.protect, toolController.getUsersTool);

router
  .route("/:id")
  .patch(
    auth.protect,
    auth.checkRoles("updateTool"),
    toolController.uploadImage,
    toolController.updateTool
  )
  .get(toolController.getToolById);

export default router;
