import Joi from "joi";
import "dotenv/config";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(5000),
    LOCAL_MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    JWT_COOKIE_EXPIRES_IN: Joi.number().description(
      "minutes after which cookie tokens expire"
    ),
    SENDINBLUE_EMAIL: Joi.string().description(
      "the from field in the emails sent by the app -- sendinBlue platform"
    ),
    SENDINBLUE_PASSWORD: Joi.string().description(
      "password for SendInBlue email SMTP server"
    ),
    SENDINBLUE_API_KEY: Joi.string().description(
      "sendInBlue Api key for SMTP email server"
    ),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app"
    ),
    CLIENT_URL: Joi.string().description("Client url"),
    CLIENT_ENV: Joi.boolean().description("Client environment").default(false),
    GOOGLE_CLIENT_ID: Joi.string().description("google client id"),
    GOOGLE_CLIENT_SECRET: Joi.string().description("google client secret key"),
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
    url:
      envVars.LOCAL_MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
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
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
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

export default config;
