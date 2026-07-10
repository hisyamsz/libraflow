import type { Request } from "express";
import type { Role } from "../../generated/prisma/index.js";

export interface IUserToken {
  id: number;
  role: Role;
}

export interface IReqUser extends Request {
  user?: IUserToken;
  lang?: "id" | "en";
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
}
