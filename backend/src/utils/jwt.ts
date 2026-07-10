import jwt from "jsonwebtoken";
import type { IUserToken } from "./interface.js";
import { JWT_SECRET } from "./env.js";

const JWT_EXPIRES_IN = "1d";

export const generateToken = (payload: IUserToken): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): IUserToken => {
  try {
    return jwt.verify(token, JWT_SECRET) as IUserToken;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
