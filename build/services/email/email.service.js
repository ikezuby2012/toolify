"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const confirmEmail_template_1 = require("./templates/confirmEmail.template");
const SibApiV3Sdk = require("sib-api-v3-typescript");
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
// Configure API key authorization: api-key
const apiKey = apiInstance.authentications.apiKey;
apiKey.apiKey =
    "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";
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
