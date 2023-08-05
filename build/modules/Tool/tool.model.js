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
const toolSchema = new mongoose_1.default.Schema({
    category: {
        type: String,
        required: [true, "category is required"],
        trim: true,
    },
    title: {
        type: String,
        required: [true, "title is required"],
    },
    description: {
        type: String,
        required: [true, "description is required"],
    },
    make: {
        type: String,
        required: [true, "make is required"],
    },
    model: {
        type: String,
        required: [true, "model is required"],
    },
    equipmentDelivery0rReturn: {
        type: String,
        required: [true, "equipmentDelivery0rReturn is required"],
    },
    paymentPlan: {
        type: { daily: Number, weekly: Number, monthly: Number },
        required: true,
    },
    availableQuantity: {
        type: Number,
        required: [true, "available quantity plan is required"],
    },
    availableLocation: {
        type: String,
        required: [true, "available plan is required"],
    },
    image: String,
    creatorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "creator id is required"],
    },
}, {
    timestamps: true,
});
toolSchema.pre(/^find/, function (next) {
    this.populate({
        path: "User",
    });
    next();
});
// add plugin that converts mongoose to json
toolSchema.plugin(toJSON_1.default);
toolSchema.plugin(paginate_1.default);
const Tool = mongoose_1.default.model("Tool", toolSchema);
exports.default = Tool;
