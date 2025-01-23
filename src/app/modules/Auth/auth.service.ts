import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwtHelper";
import config from "../../../config";
import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";
import emailSender from "./emialSender";
import { checkIsDeleted } from "../../../helpers/checkIsDeleted";

const loginUserIntoDB = async (payload: {
  password: string;
  email: string;
}) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (user.email && user.role) {
    await checkIsDeleted(user.email, user.role);
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Your password is incorrect!");
  }

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  //generate accessToken
  const accessToken = await jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );
  //generate refreshToken
  const refreshToken = await jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const decodedData = await jwtHelpers.verifyToken(
    refreshToken,
    config.jwt.refresh_token_secret as string
  );

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (userData.email && userData.role) {
    await checkIsDeleted(userData.email, userData.role);
  }

  const jwtPayload = {
    userId: userData.id,
    email: userData.email,
    role: userData.role,
  };
  //generate access token
  const accessToken = await jwtHelpers.generateToken(
    jwtPayload,
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  return { accessToken };
};

const changePassword = async (
  user: any,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (userData.email && userData.role) {
    await checkIsDeleted(userData.email, userData.role);
  }

  const isOldPasswordIsCorrect = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isOldPasswordIsCorrect) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Your old password is incorrect!"
    );
  }

  const hashPassword = bcrypt.hashSync(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashPassword,
    },
  });

  return {
    message: "password change successfully!",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (user.email && user.role) {
    await checkIsDeleted(user.email, user.role);
  }

  const forgotPassToken = await jwtHelpers.generateToken(
    { eamil: user.email, role: user.role, userId: user.id },
    config.jwt.forgot_password_token_secret as Secret,
    config.jwt.forgot_password_secret_expires_in as string
  );

  const resetPasswordLink =
    config.reset_password_link + `?userID=${user.id}&token=${forgotPassToken}`;

  await emailSender(
    user.email,
    "Reset Password ✔",
    `<div>
        <h2>Reset Your Password</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetPasswordLink}">
        <button>Reset Password</button></a>
          <p>If you did not request this, please ignore this email.</p>
    </div>`
  );
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isVerifiedUser = await jwtHelpers.verifyToken(
    token,
    config.jwt.forgot_password_token_secret as Secret
  );

  if (!isVerifiedUser) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  }

  const hashPassword = bcrypt.hashSync(payload.newPassword, 12);

  const updatePassword = await prisma.user.update({
    where: {
      id: user.id,
      email: user.email,
    },
    data: {
      password: hashPassword,
    },
  });
  return updatePassword;
};

export const AuthService = {
  loginUserIntoDB,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
