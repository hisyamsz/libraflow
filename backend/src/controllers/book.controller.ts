import type { Response, NextFunction } from "express";
import response from "../utils/response.js";
import {
  createBookSchema,
  updateBookSchema,
} from "../validations/book.validation.js";
import type { IPaginationQuery, IReqUser } from "../utils/interface.js";
import { prisma } from "../lib/prisma.js";
import { getPaginationParams } from "../utils/pagination.js";
import { removeUndefined } from "../utils/object.js";

export default {
  async create(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const result = createBookSchema.safeParse(req.body);

      if (!result.success) {
        return next(result.error);
      }

      const data = result.data;

      const category = await prisma.category.findUnique({
        where: { id: Number(data.categoryId) },
      });

      if (!category) {
        return response.notFound(res, "category.notFound");
      }

      const book = await prisma.book.create({
        data: {
          categoryId: Number(data.categoryId),
          title: data.title,
          author: data.author,
          stock: Number(data.stock),

          publisher: data.publisher ?? null,
          year: Number(data.year) ?? null,
          isbn: data.isbn ?? null,
          coverImage: data.coverImage ?? null,
          description: data.description ?? null,
        },
      });

      return response.created(res, book, "book.createSuccess");
    } catch (error: any) {
      if (error.code === "P2002") {
        return response.badRequest(res, "book.isbnAlreadyUsed");
      }

      next(error);
    }
  },

  async findAll(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const { search, categoryId } =
        req.query as unknown as IPaginationQuery & {
          categoryId?: string;
        };
      const { page, limit, skip } = getPaginationParams(req);

      const where: any = {};

      if (search) {
        where.OR = [
          { title: { contains: search } },
          { author: { contains: search } },
        ];
      }

      if (categoryId) {
        where.categoryId = Number(categoryId);
      }

      const [books, count] = await Promise.all([
        prisma.book.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            category: true,
          },
        }),
        prisma.book.count({ where }),
      ]);

      return response.pagination(
        res,
        books,
        {
          current: page,
          total: count,
          totalPage: Math.ceil(count / limit),
        },
        "book.findAllSuccess",
      );
    } catch (error) {
      next(error);
    }
  },

  async findOne(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return response.badRequest(res, "book.invalidId");
      }

      const book = await prisma.book.findUnique({
        where: { id },
        include: { category: true },
      });

      if (!book) {
        return response.notFound(res, "book.notFound");
      }

      return response.success(res, book, "book.findOneSuccess");
    } catch (error) {
      next(error);
    }
  },

  async update(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return response.notFound(res, "book.invalidId");
      }

      const existing = await prisma.book.findUnique({
        where: { id },
      });

      if (!existing) {
        return response.notFound(res, "book.notFound");
      }

      const result = updateBookSchema.safeParse(req.body);

      if (!result.success) {
        return next(result.error);
      }

      const data = result.data;

      const dataToUpdate = Object.fromEntries(
        Object.entries(removeUndefined(data))
          .map(([key, value]) => [key, value === "" ? null : value]),
      );
      const book = await prisma.book.update({
        where: { id },
        data: dataToUpdate,
      });

      return response.success(res, book, "book.updateSuccess");
    } catch (error: any) {
      if (error.code === "P2002") {
        return response.badRequest(res, "book.isbnAlreadyUsed");
      }

      next(error);
    }
  },

  async remove(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const existing = await prisma.book.findUnique({
        where: { id },
      });

      if (!existing) {
        return response.notFound(res, "book.notFound");
      }

      const book = await prisma.book.delete({
        where: { id },
      });

      return response.success(res, book, "book.deleteSuccess");
    } catch (error) {
      next(error);
    }
  },
};
