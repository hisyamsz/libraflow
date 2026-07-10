import type { Request, Response, NextFunction } from "express";
import { loginSchema } from "../validations/auth.validation.js";
import response from "../utils/response.js";
import { prisma } from "../lib/prisma.js";
import { verifyPassword } from "../utils/encryption.js";
import { generateToken } from "../utils/jwt.js";
import type { IReqUser } from "../utils/interface.js";
import { userSelect } from "../utils/user.js";

export default {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = loginSchema.safeParse(req.body);

      if (!result.success) {
        return next(result.error);
      }

      const { identifier, password } = result.data;

      const isEmail = identifier.includes("@");

      const normalizedIdentifier = isEmail
        ? identifier.trim().toLowerCase()
        : identifier.trim();

      const user = await prisma.user.findFirst({
        where: isEmail
          ? { email: normalizedIdentifier }
          : { nis: normalizedIdentifier },
      });

      if (!user) {
        return response.notFound(res, "auth.userNotFound");
      }

      const isValid = await verifyPassword(password, user.password);

      if (!isValid) {
        return response.badRequest(res, "auth.invalidCredentials");
      }

      const token = generateToken({
        id: user.id,
        role: user.role,
      });

      return response.success(res, token, "auth.loginSuccess");
    } catch (error) {
      next(error);
    }
  },

  me: async (req: IReqUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return response.unauthorized(res, "common.unauthorized");
      }

      const result = await prisma.user.findUnique({
        where: { id: user?.id },
        select: userSelect,
      });

      if (!result) {
        return response.notFound(res, "auth.userNotFound");
      }

      return response.success(res, result, "auth.profileSuccess");
    } catch (error) {
      next(error);
    }
  },
};
