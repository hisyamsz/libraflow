import type { NextFunction, Response } from "express";
import response from "../utils/response.js";
import { Role } from "../../generated/prisma/index.js";
import type { IReqUser } from "../utils/interface.js";

export default (roles: Role[]) => {
  return (req: IReqUser, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return response.unauthorized(res, "common.unauthorized");
    }

    if (!roles.includes(userRole)) {
      return response.forbidden(res, "common.forbidden");
    }

    next();
  };
};
