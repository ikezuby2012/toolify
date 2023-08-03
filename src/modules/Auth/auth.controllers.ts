import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utils";
import { User } from "../user";

import { generateOtp } from "../../services/otp/otp.service";
import { createSendToken } from "../token/token.service";
import * as authService from "./auth.service";
import { logger } from "../logger";
import { sendOtpEmail } from "../../services/email/email.service";
import { IUserDoc } from "../user/user.interfaces";

export const register = catchAsync(async (req: Request, res: Response) => {
  const otp = generateOtp();

  const newUser = await User.create({
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
    sendOtpEmail(req.body.email, req.body.name, otp);
  } catch (err: any) {
    logger.error(`${err.message}`, "email could not be sent");
  }

  createSendToken(newUser, 201, req, res);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { id, otp } = req.body;
  const user = await authService.verifyUserEmail(id, otp);

  res.status(httpStatus.ACCEPTED).json({
    status: "success",
    data: user,
  });
});

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const regenerateOtp = catchAsync(async (req: Request, res: Response) => {
  const otp = generateOtp();
  const { id } = req.params;

  const user = (await authService.regenerateNewOtp(id, otp)) as IUserDoc;

  // send otp to user
  try {
    sendOtpEmail(user.email, user.name, otp);
  } catch (err: any) {
    logger.error(`${err.message}`, "email could not be sent");
  }

  res.status(httpStatus.OK).json({
    status: "success",
    otp,
    data: user,
  });
});
