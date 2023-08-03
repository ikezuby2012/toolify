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
exports.updateToolById = exports.getToolById = void 0;
const http_status_1 = __importDefault(require("http-status"));
const tool_model_1 = __importDefault(require("./tool.model"));
const errors_1 = require("../errors");
/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
const getToolById = (id) => __awaiter(void 0, void 0, void 0, function* () { return tool_model_1.default.findById(id); });
exports.getToolById = getToolById;
/**
 * Update tool by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateToolBody} updateBody
 * @returns {Promise<IToolDoc | null>}
 */
const updateToolById = (userId, updateTool) => __awaiter(void 0, void 0, void 0, function* () {
    const tool = yield (0, exports.getToolById)(userId);
    if (!tool) {
        throw new errors_1.ApiError(http_status_1.default.NOT_FOUND, "tool not found");
    }
    Object.assign(tool, updateTool);
    yield tool.save();
    return tool;
});
exports.updateToolById = updateToolById;
