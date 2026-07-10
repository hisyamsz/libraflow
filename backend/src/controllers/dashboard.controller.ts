import type { NextFunction, Response } from "express";
import type { IReqUser } from "../utils/interface.js";
import { prisma } from "../lib/prisma.js";
import response from "../utils/response.js";

export default {
  async getStats(_req: IReqUser, res: Response, next: NextFunction) {
    try {
      const today = new Date();

      const [
        totalBooks,
        totalCategories,
        totalMembers,
        totalPendingLoans,
        totalActiveLoans,
        totalOverdueLoans,
        totalDamagedLoans,
        totalLostLoans,
        overdueLoans,
      ] = await Promise.all([
        prisma.book.count(),
        prisma.category.count(),
        prisma.user.count({
          where: {
            role: "MEMBER",
          },
        }),
        prisma.loan.count({
          where: {
            status: "PENDING",
          },
        }),
        prisma.loan.count({
          where: {
            status: "APPROVED",
          },
        }),
        prisma.loan.count({
          where: {
            status: "APPROVED",
            dueDate: { lt: today },
          },
        }),
        prisma.loan.count({
          where: {
            status: "RETURNED",
            bookCondition: "DAMAGED",
          },
        }),
        prisma.loan.count({
          where: {
            status: "RETURNED",
            bookCondition: "LOST",
          },
        }),
        prisma.loan.findMany({
          where: {
            status: "APPROVED",
            dueDate: {
              lt: today,
            },
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                nis: true,
              },
            },
            book: {
              select: {
                title: true,
              },
            },
          },
          orderBy: {
            dueDate: "asc",
          },
        }),
      ]);

      const statsData = {
        totalBooks,
        totalCategories,
        totalMembers,
        totalPendingLoans,
        totalActiveLoans,
        totalOverdueLoans,
        totalDamagedLoans,
        totalLostLoans,
        overdueLoans: overdueLoans.map((loan) => ({
          id: loan.id,
          dueDate: loan.dueDate,
          user: {
            name: loan.user.name,
            nis: loan.user.nis,
          },
          book: {
            title: loan.book.title,
          },
        })),
      };

      return response.success(res, statsData, "dashboard.statsSuccess");
    } catch (error) {
      next(error);
    }
  },

  async getMyStats(req: IReqUser, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return response.unauthorized(res, "dashboard.unauthenticated");
      }

      const [
        activeLoans,
        pendingLoans,
        returnedLoans,
        damagedReturns,
        lostReturns,
        overdueLoans,
      ] = await Promise.all([
        prisma.loan.findMany({
          where: {
            userId,
            status: "APPROVED",
          },
          include: {
            book: {
              select: {
                title: true,
                author: true,
                category: {
                  select: { name: true }
                }
              }
            }
          },
          orderBy: {
            dueDate: "asc",
          }
        }),
        prisma.loan.count({
          where: {
            userId,
            status: "PENDING",
          },
        }),
        prisma.loan.count({
          where: {
            userId,
            status: "RETURNED",
            OR: [
              { bookCondition: { not: "LOST" } },
              { bookCondition: null },
            ],
          },
        }),
        prisma.loan.count({
          where: {
            userId,
            status: "RETURNED",
            bookCondition: "DAMAGED",
          },
        }),
        prisma.loan.count({
          where: {
            userId,
            status: "RETURNED",
            bookCondition: "LOST",
          },
        }),
        prisma.loan.findMany({
          where: {
            userId,
            status: "APPROVED",
            dueDate: {
              lt: new Date(),
            },
          },
          include: {
            book: {
              select: {
                title: true,
                coverImage: true,
              },
            },
          },
          orderBy: {
            dueDate: "asc",
          },
        }),
      ]);

      const myStatsData = {
        activeLoans: activeLoans.length,
        activeLoansList: activeLoans.map((loan) => ({
          id: loan.id,
          dueDate: loan.dueDate,
          book: {
            title: loan.book.title,
            author: loan.book.author,
            categoryName: loan.book.category.name,
          },
        })),
        pendingLoans,
        returnedLoans,
        damagedReturns,
        lostReturns,
        overdueLoans: overdueLoans.map((loan) => ({
          id: loan.id,
          dueDate: loan.dueDate,
          book: {
            title: loan.book.title,
            coverImage: loan.book.coverImage ?? null,
          },
        })),
      };

      return response.success(res, myStatsData, "dashboard.myStatsSuccess");
    } catch (error) {
      next(error);
    }
  },
};
