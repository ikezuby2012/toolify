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
// import * as crypto from "crypto";
const mongoose_1 = __importDefault(require("mongoose"));
// import bcrypt from 'bcryptjs';
const validator_1 = __importDefault(require("validator"));
const toJSON_1 = __importDefault(require("../toJSON/toJSON"));
const paginate_1 = __importDefault(require("../paginate/paginate"));
const otp_service_1 = require("../../services/otp/otp.service");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "please tell us your name?"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "please provide your valid email address"],
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error("Invalid email");
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error("Password must contain at least one letter and one number");
            }
        },
        private: true, // used by the toJSON plugin
    },
    passwordConfirm: {
        type: String,
        required: [true, "please provide a confirm password"],
        minLength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error("Password must contain at least one letter and one number");
            }
            // if (value === this.password) throw new Error("passwords does not match!")
        },
        private: true, // used by toJSON plugin
    },
    idNumber: {
        type: String,
        unique: true,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    accessRole: {
        type: String,
        enum: ["rental", "borrower"],
        default: "rental",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
userSchema.plugin(toJSON_1.default);
userSchema.plugin(paginate_1.default);
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static("isEmailTaken", function (email, excludeUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email, _id: { $ne: excludeUserId } });
        return !!user;
    });
});
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method("isPasswordMatch", function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return bcrypt.compare(password, user.password);
    });
});
/**
 * Check if password matches the passwordConfrim field
 * @param {string} password
 * @returns {any}
 */
// userSchema.path("passwordConfirm").validate(function (value) {
//   if (this.get("password") !== value) {
//     throw new Error("Password and password confirm does not match!");
//   }
// });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            user.password = yield bcrypt.hash(user.password, 12);
            user.passwordConfirm = undefined;
        }
        next();
    });
});
userSchema.method("changedPasswordAfter", function (JWTTimestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.passwordChangedAt) {
            const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
            return JWTTimestamp < changedTimestamp;
        }
        // False means NOT changed
        return false;
    });
});
userSchema.method("createPasswordResetToken", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const resetToken = (0, otp_service_1.generateOtp)();
        this.passwordResetToken = resetToken;
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
        return resetToken;
    });
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
