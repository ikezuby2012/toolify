"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Tool_1 = require("../../modules/Tool");
// import { validate } from "../../modules/validate";
const Auth_1 = require("../../modules/Auth");
const router = express_1.default.Router();
router
    .route("/")
    .post(
// validate(toolValidation.createNewTool),
Auth_1.auth.protect, Auth_1.auth.checkRoles("createTool"), Tool_1.toolController.uploadImage, Tool_1.toolController.createNewTool)
    .get(Tool_1.toolController.getAllTools);
router.route("/user").get(Auth_1.auth.protect, Tool_1.toolController.getUsersTool);
router
    .route("/:id")
    .patch(Auth_1.auth.protect, Auth_1.auth.checkRoles("updateTool"), Tool_1.toolController.uploadImage, Tool_1.toolController.updateTool)
    .get(Tool_1.toolController.getToolById);
exports.default = router;
