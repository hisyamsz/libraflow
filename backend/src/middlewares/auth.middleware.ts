import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import response from "../utils/response.js";
import type { IReqUser } from "../utils/interface.js";

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;
    let token: string | undefined;

    if (authorization) {
      const [prefix, t] = authorization.split(" ");
      if (prefix === "Bearer" && t) {
        token = t;
      }
    } else if (req.query.token) {
      token = req.query.token as string;
    }

    if (!token) {
      return response.unauthorized(res, "common.unauthorized");
    }

    const user = verifyToken(token);

    if (!user) {
      return response.unauthorized(res, "common.unauthorized");
    }

    (req as IReqUser).user = user;

    next();
  } catch (error) {
    return response.unauthorized(res, "common.unauthorized");
  }
};
