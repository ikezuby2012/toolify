"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Tool_1 = require("../../modules/Tool");
const validate_1 = require("../../modules/validate");
const Auth_1 = require("../../modules/Auth");
const router = express_1.default.Router();
router
    .route("/")
    .post((0, validate_1.validate)(Tool_1.toolValidation.createNewTool), Auth_1.auth.protect, Auth_1.auth.checkRoles("createTool"), Tool_1.toolController.createNewTool);
exports.default = router;
