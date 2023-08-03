import httpStatus from "http-status";
// import Token from '../token/token.model';
import mongoose from "mongoose";

import ApiError from "../errors/ApiError";
import { getUserByEmail, getUserById } from "../user/user.service";
import { IUserDoc, IUserWithToken } from "../user/user.interfaces";
import { User } from "../user";
import { verifyOtp } from "../../services/otp/otp.service";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<IUserDoc> => {
  if (!email || !password) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Please provide email and password!"
    );
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

/**
 * Forgotten password
 * @param {string} email
 * @returns {Promise<IUserDoc>}
 */
export const forgetPasswordServ = async (
  email: string
): Promise<IUserWithToken> => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "There is no user with email address."
    );
  }
  // 2) Generate the random reset token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const returnValue = {
    user,
    token: resetToken,
  };
  return returnValue;
};

/**
 * Verify email
 * @param {mongoose.Types.ObjectId} id
 * @param {string} otp
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyUserEmail = async (
  id: mongoose.Types.ObjectId,
  otp: string
): Promise<IUserDoc | null> => {
  const verify = verifyOtp(otp);

  if (!verify) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "otp has expired!, request for a new OTP"
    );
  }

  const user = (await getUserById(id)) as any;

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "USER NOT FOUND");

  if (user && user.otp !== otp) {
    throw new ApiError(httpStatus.NOT_FOUND, "INVALID OTP");
  }

  const updatedUser = await User.findByIdAndUpdate(
    user.id,
    {
      isEmailVerified: true,
      otp: null,
    },
    { new: true }
  );

  return updatedUser;
};

/**
 * regenerate otp
 * @param {mongoose.Types.ObjectId | string} id
 * @param {string} otp
 * @returns {Promise<IUserDoc>}
 */
export const regenerateNewOtp = async (
  id: mongoose.Types.ObjectId | string,
  otp: string
): Promise<IUserDoc | null> => {
  const updatedUser = await User.findByIdAndUpdate(id, { otp }, { new: true });

  return updatedUser;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
// export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
//   try {
//     const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
//     const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
//     if (!user) {
//       throw new Error();
//     }
//     await refreshTokenDoc.remove();
//     const tokens = await generateAuthTokens(user);
//     return { user, tokens };
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
//   }
// };

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
// export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
//   try {
//     const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
//     const user = await getUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.user));
//     if (!user) {
//       throw new Error();
//     }
//     await updateUserById(user.id, { password: newPassword });
//     await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
//   }
// };
