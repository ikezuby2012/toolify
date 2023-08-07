import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utils";
import { User } from "../user";

import { generateOtp } from "../../services/otp/otp.service";
import { createSendToken } from "../token/token.service";
import * as authService from "./auth.service";
import { logger } from "../logger";
import {
  sendOtpEmail,
  sendPasswordReset,
} from "../../services/email/email.service";
import { IUserDoc } from "../user/user.interfaces";
import { ApiError } from "../errors";

export const register = catchAsync(async (req: Request, res: Response) => {
  const otp = generateOtp();

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    idNumber: req.body.idNumber,
    phoneNumber: req.body.phoneNumber,
    accessRole: req.body.accessRole,
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

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ApiError(404, "There is no user with email address."));
    }

    // 2) Generate the random reset token
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // console.log(resetToken, ": reset token");

    // send it to user email
    try {
      sendPasswordReset(req.body.email, resetToken);

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new ApiError(
          httpStatus.BAD_REQUEST,
          "There was an error sending the email. Try again later"
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the otp
    const { otp } = req.body;
    const token = otp;
    // get user based on reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(
        new ApiError(httpStatus.NOT_FOUND, "Token is invalid or has expired")
      );
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, req, res);
  }
);
