import type { Request } from "express";

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Mengurai (parse) parameter 'page' dan 'limit' dari query string Express secara aman.
 * Menjamin limit tidak melebihi batas maksimal (default 100) dan menghitung nilai 'skip' database secara otomatis.
 */
export function getPaginationParams(
  req: Request,
  defaultLimit = 10,
  maxLimit = 100
): ParsedPagination {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(req.query.limit as string) || defaultLimit)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
