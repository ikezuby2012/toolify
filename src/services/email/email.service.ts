import { confirmEmail } from "./templates/confirmEmail.template";
import { passwordReset } from "./templates/passwordReset.template";

const SibApiV3Sdk = require("sib-api-v3-typescript");

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Configure API key authorization: api-key
const apiKey = apiInstance.authentications.apiKey;
apiKey.apiKey =
  "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";

const sendSMTPEmail = new SibApiV3Sdk.SendSmtpEmail();

export const sendOtpEmail = (
  userMail: string,
  userName: string,
  pin: string
) => {
  const html = confirmEmail(pin);

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

  apiInstance.sendTransacEmail(sendSMTPEmail).then(
    function (data) {
      console.log(`Email API called successfully. Returned data: ${data}`);
    },
    function (error) {
      console.error(error);
    }
  );
};

export const sendPasswordReset = (userMail: string, pin: string) => {
  const html = passwordReset(pin);

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

  apiInstance.sendTransacEmail(sendSMTPEmail).then(
    function (data) {
      console.log(`Email API called successfully. Returned data: ${data}`);
    },
    function (error) {
      console.error(error);
    }
  );
};
