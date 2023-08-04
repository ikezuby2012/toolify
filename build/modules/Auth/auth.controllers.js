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
exports.resetPassword = exports.forgotPassword = exports.regenerateOtp = exports.logout = exports.verifyEmail = exports.login = exports.register = void 0;
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../utils");
const user_1 = require("../user");
const otp_service_1 = require("../../services/otp/otp.service");
const token_service_1 = require("../token/token.service");
const authService = __importStar(require("./auth.service"));
const logger_1 = require("../logger");
const email_service_1 = require("../../services/email/email.service");
const errors_1 = require("../errors");
exports.register = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, otp_service_1.generateOtp)();
    const newUser = yield user_1.User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        idNumber: req.body.idNumber,
        phoneNumber: req.body.phoneNumber,
        otp,
    });
    // sent otp to user email
    try {
        (0, email_service_1.sendOtpEmail)(req.body.email, req.body.name, otp);
    }
    catch (err) {
        logger_1.logger.error(`${err.message}`, "email could not be sent");
    }
    (0, token_service_1.createSendToken)(newUser, 201, req, res);
}));
exports.login = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield authService.loginUserWithEmailAndPassword(email, password);
    // 3) If everything ok, send token to client
    (0, token_service_1.createSendToken)(user, 200, req, res);
}));
exports.verifyEmail = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, otp } = req.body;
    const user = yield authService.verifyUserEmail(id, otp);
    res.status(http_status_1.default.ACCEPTED).json({
        status: "success",
        data: user,
    });
}));
const logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};
exports.logout = logout;
exports.regenerateOtp = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, otp_service_1.generateOtp)();
    const { id } = req.params;
    const user = (yield authService.regenerateNewOtp(id, otp));
    // send otp to user
    try {
        (0, email_service_1.sendOtpEmail)(user.email, user.name, otp);
    }
    catch (err) {
        logger_1.logger.error(`${err.message}`, "email could not be sent");
    }
    res.status(http_status_1.default.OK).json({
        status: "success",
        otp,
        data: user,
    });
}));
exports.forgotPassword = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on POSTed email
    const user = yield user_1.User.findOne({ email: req.body.email });
    if (!user) {
        return next(new errors_1.ApiError(404, "There is no user with email address."));
    }
    // 2) Generate the random reset token
    const resetToken = yield user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    // console.log(resetToken, ": reset token");
    // send it to user email
    try {
        (0, email_service_1.sendPasswordReset)(req.body.email, resetToken);
        res.status(200).json({
            status: "success",
            message: "Token sent to email!",
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "There was an error sending the email. Try again later"));
    }
}));
exports.resetPassword = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("it hits here!");
    // get the otp
    const { otp } = req.body;
    const token = otp;
    // get user based on reset token
    const user = yield user_1.User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
    });
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new errors_1.ApiError(http_status_1.default.NOT_FOUND, "Token is invalid or has expired"));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    (0, token_service_1.createSendToken)(user, 200, req, res);
}));
