"use strict";
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
exports.AddToCart = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const cart_model_1 = __importDefault(require("./cart.model"));
exports.AddToCart = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newCart = yield cart_model_1.default.create({
        userId: req.body.userId,
        tool: req.body.tool,
        quantity: req.body.quantity,
    });
    res.status(http_status_1.default.OK).json({
        status: "success",
        data: newCart,
    });
}));
