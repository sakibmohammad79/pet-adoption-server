import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwtHelper";
import config from "../../../config";
import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";
import emailSender from "./emialSender";

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

  const forgotPassToken = await jwtHelpers.generateToken(
    { eamil: user.email, role: user.role, userId: user.id },
    config.jwt.forgot_password_token_secret as Secret,
    config.jwt.forgot_password_secret_expires_in as string
  );

  const resetPasswordLink =
    config.reset_password_link + `?userID=${user.id}&token=${forgotPassToken}`;

  await emailSender(
    user.email,
    `<div>
        <h2>Reset Your Password</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetPasswordLink}">
        <button>Reset Password</button></a>
          <p>If you did not request this, please ignore this email.</p>
    </div>`
  );
};

export const AuthService = {
  loginUserIntoDB,
  refreshToken,
  changePassword,
  forgotPassword,
};
