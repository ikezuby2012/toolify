"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
require("dotenv/config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string()
        .valid("production", "development", "test")
        .required(),
    PORT: joi_1.default.number().default(5000),
    LOCAL_MONGODB_URL: joi_1.default.string().required().description("Mongo DB url"),
    JWT_SECRET: joi_1.default.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: joi_1.default.number()
        .default(30)
        .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: joi_1.default.number()
        .default(30)
        .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description("minutes after which verify email token expires"),
    JWT_COOKIE_EXPIRES_IN: joi_1.default.number().description("minutes after which cookie tokens expire"),
    SENDINBLUE_EMAIL: joi_1.default.string().description("the from field in the emails sent by the app -- sendinBlue platform"),
    SENDINBLUE_PASSWORD: joi_1.default.string().description("password for SendInBlue email SMTP server"),
    SENDINBLUE_API_KEY: joi_1.default.string().description("sendInBlue Api key for SMTP email server"),
    SMTP_HOST: joi_1.default.string().description("server that will send the emails"),
    SMTP_PORT: joi_1.default.number().description("port to connect to the email server"),
    SMTP_USERNAME: joi_1.default.string().description("username for email server"),
    SMTP_PASSWORD: joi_1.default.string().description("password for email server"),
    EMAIL_FROM: joi_1.default.string().description("the from field in the emails sent by the app"),
    CLIENT_URL: joi_1.default.string().description("Client url"),
    CLIENT_ENV: joi_1.default.boolean().description("Client environment").default(false),
    GOOGLE_CLIENT_ID: joi_1.default.string().description("google client id"),
    GOOGLE_CLIENT_SECRET: joi_1.default.string().description("google client secret key"),
})
    .unknown();
const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.LOCAL_MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        jwtExpiresIn: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        cookieExpiresIn: envVars.JWT_COOKIE_EXPIRES_IN,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
        cookieOptions: {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            signed: true,
        },
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
    },
    sendBlue: {
        email: envVars.SENDINBLUE_EMAIL,
        pass: envVars.SENDINBLUE_PASSWORD,
        api_key: envVars.SENDINBLUE_API_KEY,
    },
    clientUrl: envVars.CLIENT_URL,
    clientEnv: envVars.CLIENT_ENV,
    googleClientId: envVars.GOOGLE_CLIENT_ID,
    googleSecretId: envVars.GOOGLE_CLIENT_SECRET,
};
exports.default = config;
