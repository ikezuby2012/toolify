"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.refreshTokens = exports.logout = exports.login = exports.register = void 0;
const custom_validation_1 = require("../validate/custom.validation");
const Joi = require("joi");
const registerBody = {
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(custom_validation_1.password),
    passwordConfirm: Joi.string().required().custom(custom_validation_1.password),
    name: Joi.string().required(),
    idNumber: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    accessRole: Joi.string(),
};
exports.register = {
    body: Joi.object().keys(registerBody),
};
exports.login = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
};
exports.logout = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};
exports.refreshTokens = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};
exports.forgotPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
};
exports.resetPassword = {
    // params: Joi.object().keys({
    //   otp: Joi.string().required(),
    // }),
    body: Joi.object().keys({
        password: Joi.string().required().custom(custom_validation_1.password),
        passwordConfirm: Joi.string().required().custom(custom_validation_1.password),
        otp: Joi.string().required(),
    }),
};
exports.verifyEmail = {
    body: Joi.object().keys({
        id: Joi.string().required(),
        otp: Joi.string().required(),
    }),
};
