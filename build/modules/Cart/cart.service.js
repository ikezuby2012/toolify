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
exports.getBorrowedTools = exports.deleteCartById = exports.queryDoc = exports.getCartById = void 0;
const http_status_1 = __importDefault(require("http-status"));
const cart_model_1 = __importDefault(require("./cart.model"));
const errors_1 = require("../errors");
/**
 * Get document by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICartDoc | null>}
 */
const getCartById = (id) => __awaiter(void 0, void 0, void 0, function* () { return cart_model_1.default.findById(id); });
exports.getCartById = getCartById;
/**
 * Query for carts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryDoc = (filter, options) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield cart_model_1.default.paginate(filter, options);
    return doc;
});
exports.queryDoc = queryDoc;
/**
 * Delete doc by id
 * @param {mongoose.Types.ObjectId} DocId
 * @returns {Promise<ICartDoc | null>}
 */
const deleteCartById = (DocId) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield cart_model_1.default.findByIdAndDelete(DocId);
    if (!doc) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, "Doc not found");
    }
    return doc;
});
exports.deleteCartById = deleteCartById;
/**
 * Get borrowed tools
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICartDoc | null>}
 */
const getBorrowedTools = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tools = (yield cart_model_1.default.find({ userId: id }));
    return tools;
});
exports.getBorrowedTools = getBorrowedTools;
