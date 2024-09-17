import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  const accessToken = jwt.sign(jwtPayload, "abcde", {
    algorithm: "HS256",
    expiresIn: "1d",
  });
  //generate refreshToken
  const refreshToken = jwt.sign(jwtPayload, "abcdefgh", {
    algorithm: "HS256",
    expiresIn: "30d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginUserIntoDB,
};
