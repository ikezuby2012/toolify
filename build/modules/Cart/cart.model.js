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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const toJSON_1 = __importDefault(require("../toJSON/toJSON"));
const paginate_1 = __importDefault(require("../paginate/paginate"));
const cartSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "creator id is required"],
    },
    tool: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tool",
        required: [true, "creator id is required"],
    },
    quantity: {
        type: Number,
    },
}, {
    timestamps: true,
});
cartSchema.pre(/^find/, function (next) {
    this.populate({
        path: "userId tool",
    });
    next();
});
// add plugin that converts mongoose to json
cartSchema.plugin(toJSON_1.default);
cartSchema.plugin(paginate_1.default);
const Cart = mongoose_1.default.model("Cart", cartSchema);
exports.default = Cart;
