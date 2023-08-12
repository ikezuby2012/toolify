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
exports.deletePaymentById = exports.getUsersPaymentHistory = exports.getPaymentById = exports.getAllPayment = exports.PostPayment = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils");
const payment_model_1 = __importDefault(require("./payment.model"));
const paymentService = __importStar(require("./payment.service"));
exports.PostPayment = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = Object.assign(Object.assign({}, req.body), { userId: req.user.id });
    const newPayment = yield payment_model_1.default.create(body);
    res.status(http_status_1.default.OK).json({
        status: "success",
        data: newPayment,
    });
}));
exports.getAllPayment = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, utils_1.pick)(req.query, [
        "sortBy",
        "limit",
        "page",
        "projectBy",
    ]);
    const { results, page, limit, totalPages, totalResults } = yield paymentService.queryDocs({}, options);
    res.status(http_status_1.default.OK).json({
        status: "success",
        data: results,
        info: {
            page,
            limit,
            totalPages,
            totalResults,
        },
    });
}));
exports.getPaymentById = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params.id === "string") {
        const payment = yield paymentService.getPaymentById(new mongoose_1.default.Types.ObjectId(req.params.id));
        res.status(http_status_1.default.OK).json({
            status: "success",
            data: payment,
        });
    }
}));
exports.getUsersPaymentHistory = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = (yield paymentService.getPaymentCreatedId(req.user.id));
    res.status(http_status_1.default.OK).json({
        status: "success",
        length: payments === null || payments === void 0 ? void 0 : payments.length,
        data: payments,
    });
}));
exports.deletePaymentById = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.params.id === "string") {
        yield paymentService.deletePaymentById(new mongoose_1.default.Types.ObjectId(req.params.id));
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
