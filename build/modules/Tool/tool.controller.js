"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTool = exports.createNewTool = exports.uploadImage = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const utils_1 = require("../utils");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const tool_model_1 = __importDefault(require("./tool.model"));
const config_1 = __importDefault(require("../../config"));
const toolService = __importStar(require("./tool.service"));
cloudinary_1.v2.config({
    cloud_name: "dilvag5dx",
    api_key: config_1.default.cloud.apiKey,
    api_secret: config_1.default.cloud.apiSecret,
});
const cloudStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        allowed_formats: ["jpg", "png"],
        folder: () => "toolify",
    },
});
const parser = (0, multer_1.default)({ storage: cloudStorage });
exports.uploadImage = parser.single("image");
exports.createNewTool = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { category, title, description, make, model, equipmentDelivery0rReturn, availableQuantity, availableLocation, creatorId, } = req.body;
    const tool = {
        category,
        title,
        description,
        make,
        model,
        equipmentDelivery0rReturn,
        paymentPlan: {
            daily: parseInt(req.body["paymentPlan.daily"], 10),
            weekly: parseInt(req.body["paymentPlan.weekly"], 10),
            monthly: parseInt(req.body["paymentPlan.monthly"], 10),
        },
        availableQuantity: parseInt(availableQuantity, 10),
        availableLocation,
        creatorId,
        image: req.file ? req.file.path : (_a = req.body.image) !== null && _a !== void 0 ? _a : "",
    };
    const newTool = yield tool_model_1.default.create(tool);
    res.status(http_status_1.default.OK).json({
        status: "success",
        data: newTool,
    });
}));
exports.updateTool = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params.Id === "string") {
        const tool = yield toolService.updateToolById(new mongoose_1.default.Types.ObjectId(req.params.userId), req.body);
        res.status(http_status_1.default.OK).json({
            status: "success",
            data: tool,
        });
    }
    else {
        return next(new ApiError_1.default(http_status_1.default.NOT_FOUND, "id is required"));
    }
}));
