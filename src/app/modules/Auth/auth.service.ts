import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwtHelper";

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
    throw new Error("Your password is incorrect!");
  }

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  //generate accessToken
  const accessToken = await jwtHelpers.generateToken(jwtPayload, "abced", "3d");
  //generate refreshToken
  const refreshToken = await jwtHelpers.generateToken(
    jwtPayload,
    "abcedef",
    "30d"
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshToken: string) => {
  const decodedData = await jwtHelpers.verifyToken(refreshToken, "abcedef");

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
  const accessToken = await jwtHelpers.generateToken(jwtPayload, "abced", "3d");

  return { accessToken };
};

export const AuthService = {
  loginUserIntoDB,
  refreshToken,
};
