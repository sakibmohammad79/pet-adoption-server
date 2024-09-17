import { JwtPayload, Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const generateToken = async (
  jwtPayload: JwtPayload,
  secret: Secret,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    algorithm: "HS256",
    expiresIn,
  });
};

const verifyToken = async (token: string, secret: Secret) => {
  try {
    const decodedData = jwt.verify(token, secret) as JwtPayload;
    return decodedData;
  } catch {
    throw new Error("You are not authorized!");
  }
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
