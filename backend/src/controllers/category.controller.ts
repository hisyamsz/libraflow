import type { Response, NextFunction } from "express";
import response from "../utils/response.js";
import type { IPaginationQuery, IReqUser } from "../utils/interface.js";
import { createCategorySchema } from "../validations/category.validation.js";
import { prisma } from "../lib/prisma.js";
import { getPaginationParams } from "../utils/pagination.js";
import { removeUndefined } from "../utils/object.js";

export default {
  async create(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const result = createCategorySchema.safeParse(req.body);

      if (!result.success) {
        return next(result.error);
      }

      const { name, description } = result.data;

      const existing = await prisma.category.findFirst({
        where: { name },
      });

      if (existing) {
        return response.badRequest(res, "category.alreadyExists");
      }

      const category = await prisma.category.create({
        data: {
          name,
          description: description ?? null,
        },
      });

      return response.created(res, category, "category.createSuccess");
    } catch (error) {
      next(error);
    }
  },

  async findAll(req: IReqUser, res: Response, next: NextFunction) {
    const { search } = req.query as unknown as IPaginationQuery;
    const { page, limit, skip } = getPaginationParams(req);

    try {
      const where = search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                },
              },
              {
                description: {
                  contains: search,
                },
              },
            ],
          }
        : {};

      const [result, count] = await Promise.all([
        prisma.category.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.category.count({ where }),
      ]);

      return response.pagination(
        res,
        result,
        {
          current: page,
          total: count,
          totalPage: Math.ceil(count / limit),
        },
        "category.findAllSuccess",
      );
    } catch (error) {
      next(error);
    }
  },

  async findOne(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const categoryId = Number(id);

      if (isNaN(categoryId)) {
        return response.badRequest(res, "category.invalidId");
      }

      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return response.notFound(res, "category.notFound");
      }

      return response.success(res, category, "category.findOneSuccess");
    } catch (error) {
      next(error);
    }
  },

  async update(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const categoryId = Number(id);

      if (isNaN(categoryId)) {
        return response.notFound(res, "category.invalidId");
      }

      const existing = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!existing) {
        return response.notFound(res, "category.notFound");
      }

      const result = createCategorySchema.partial().safeParse(req.body);
      if (!result.success) {
        return next(result.error);
      }

      const dataToUpdate = removeUndefined(result.data);

      const category = await prisma.category.update({
        where: { id: categoryId },
        data: dataToUpdate,
      });

      return response.success(res, category, "category.updateSuccess");
    } catch (error) {
      next(error);
    }
  },

  async remove(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const categoryId = Number(id);

      if (isNaN(categoryId)) {
        return response.notFound(res, "category.invalidId");
      }

      const existing = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!existing) {
        return response.notFound(res, "category.notFound");
      }

      const category = await prisma.category.delete({
        where: { id: categoryId },
      });

      return response.success(res, category, "category.deleteSuccess");
    } catch (error) {
      next(error);
    }
  },
};
