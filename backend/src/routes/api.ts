import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import categoryController from "../controllers/category.controller.js";
import aclMiddleware from "../middlewares/acl.middleware.js";
import { Role } from "../../generated/prisma/index.js";
import bookController from "../controllers/book.controller.js";
import loanController from "../controllers/loan.controller.js";
import dashboardController from "../controllers/dashboard.controller.js";
import userController from "../controllers/user.controller.js";
import { uploadExcel } from "../middlewares/upload.middleware.js";
const router = express.Router();

// router.post("/auth/register", authController.register); // Digantikan oleh POST /users
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);

router.get("/categories", categoryController.findAll);
router.get("/categories/:id", categoryController.findOne);
router.post(
  "/categories",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  categoryController.create,
);
router.put(
  "/categories/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  categoryController.update,
);
router.delete(
  "/categories/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  categoryController.remove,
);

router.get("/books", bookController.findAll);
router.get("/books/:id", bookController.findOne);
router.post(
  "/books",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  bookController.create,
);

router.put(
  "/books/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  bookController.update,
);

router.delete(
  "/books/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  bookController.remove,
);

// Loans
router.post(
  "/loans",
  [authMiddleware, aclMiddleware([Role.MEMBER])],
  loanController.create,
);

router.get("/loans/my", authMiddleware, loanController.findMyLoans);

router.get(
  "/loans",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  loanController.findAll,
);

router.get(
  "/loans/export/pdf",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  loanController.exportPdf,
);

router.patch(
  "/loans/:id/approve",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  loanController.approve,
);

router.patch(
  "/loans/:id/reject",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  loanController.reject,
);

router.patch(
  "/loans/:id/return",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  loanController.returnLoan,
);

// Dashboard
router.get(
  "/dashboard/stats",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  dashboardController.getStats,
);

router.get(
  "/dashboard/my-stats",
  authMiddleware,
  dashboardController.getMyStats,
);

// Users Management (Admin Only)
router.get(
  "/users",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  userController.findAll,
);

router.post(
  "/users",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  userController.create,
);

router.post(
  "/users/import",
  [authMiddleware, aclMiddleware([Role.ADMIN]), uploadExcel],
  userController.importExcel,
);

router.put(
  "/users/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  userController.update,
);

router.delete(
  "/users/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  userController.remove,
);

router.patch(
  "/users/change-password",
  authMiddleware,
  userController.changePassword,
);

router.patch(
  "/users/:id/reset-password",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  userController.resetPassword,
);

export default router;
