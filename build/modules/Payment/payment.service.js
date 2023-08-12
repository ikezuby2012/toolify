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
exports.deletePaymentById = exports.getPaymentCreatedId = exports.queryDocs = exports.getPaymentById = void 0;
const http_status_1 = __importDefault(require("http-status"));
const payment_model_1 = __importDefault(require("./payment.model"));
const errors_1 = require("../errors");
/**
 * Get document by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IPaymentDoc | null>}
 */
const getPaymentById = (id) => __awaiter(void 0, void 0, void 0, function* () { return payment_model_1.default.findById(id); });
exports.getPaymentById = getPaymentById;
/**
 * Query for payment
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryDocs = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield payment_model_1.default.paginate(filter, options);
    return doc;
});
exports.queryDocs = queryDocs;
/**
 * Get Payment created by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IPaymentDoc | null>}
 */
const getPaymentCreatedId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = (yield payment_model_1.default.find({ userId: id }));
    return payment;
});
exports.getPaymentCreatedId = getPaymentCreatedId;
/**
 * Delete payment by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IPaymentDoc | null>}
 */
const deletePaymentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield payment_model_1.default.findByIdAndDelete(id);
    if (!doc) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, "payment not found");
    }
    return doc;
});
exports.deletePaymentById = deletePaymentById;
