"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Tool_1 = require("../../modules/Tool");
const Auth_1 = require("../../modules/Auth");
const router = express_1.default.Router();
router.route("/").post(
// validate(toolValidation.createNewTool),
Auth_1.auth.protect, Auth_1.auth.checkRoles("createTool"), Tool_1.toolController.uploadImage, Tool_1.toolController.createNewTool);
exports.default = router;
