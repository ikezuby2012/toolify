"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordReset = exports.sendOtpEmail = void 0;
const confirmEmail_template_1 = require("./templates/confirmEmail.template");
const passwordReset_template_1 = require("./templates/passwordReset.template");
const config_1 = __importDefault(require("../../config"));
const { api_key: ApiKey } = config_1.default.sendBlue;
const SibApiV3Sdk = require("sib-api-v3-typescript");
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
// Configure API key authorization: api-key
const apiKey = apiInstance.authentications.apiKey;
apiKey.apiKey = ApiKey;
const sendSMTPEmail = new SibApiV3Sdk.SendSmtpEmail();
const sendOtpEmail = (userMail, userName, pin) => {
    const html = (0, confirmEmail_template_1.confirmEmail)(pin);
    sendSMTPEmail.subject = "welcome! we want to confirm your account";
    sendSMTPEmail.htmlContent = html;
    sendSMTPEmail.sender = {
        name: "toolify",
        email: "ikezuby2012@gmail.com",
    };
    sendSMTPEmail.to = [
        {
            email: userMail,
            name: userName,
        },
    ];
    apiInstance.sendTransacEmail(sendSMTPEmail).then(function (data) {
        console.log(`Email API called successfully. Returned data: ${data}`);
    }, function (error) {
        console.error(error);
    });
};
exports.sendOtpEmail = sendOtpEmail;
const sendPasswordReset = (userMail, pin) => {
    const html = (0, passwordReset_template_1.passwordReset)(pin);
    sendSMTPEmail.subject = "Reset Your Password!";
    sendSMTPEmail.htmlContent = html;
    sendSMTPEmail.sender = {
        name: "toolify",
        email: "ikezuby2012@gmail.com",
    };
    sendSMTPEmail.to = [
        {
            email: userMail,
            name: "name",
        },
    ];
    apiInstance.sendTransacEmail(sendSMTPEmail).then(function (data) {
        console.log(`Email API called successfully. Returned data: ${data}`);
    }, function (error) {
        console.error(error);
    });
};
exports.sendPasswordReset = sendPasswordReset;
