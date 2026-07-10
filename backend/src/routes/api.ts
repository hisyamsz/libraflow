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

router.post(
  "/auth/login",
  authController.login
  /*
  #swagger.tags = ["Auth"]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/LoginRequest'}
  }
  #swagger.responses[200] = {
    description: "Berhasil login",
    schema: {$ref: '#/components/schemas/LoginResponse'}
  }
  */
);

router.get(
  "/auth/me",
  authMiddleware,
  authController.me
  /*
  #swagger.tags = ["Auth"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.responses[200] = {
    description: "Berhasil mengambil profil",
    schema: {
      data: {$ref: '#/components/schemas/ProfileResponse'}
    }
  }
  */
);

router.get(
  "/categories",
  categoryController.findAll
  /*
  #swagger.tags = ["Categories"]
  #swagger.parameters['search'] = { in: 'query', type: 'string' }
  #swagger.parameters['page'] = { in: 'query', type: 'integer' }
  #swagger.parameters['limit'] = { in: 'query', type: 'integer' }
  */
);

router.get(
  "/categories/:id",
  categoryController.findOne
  /*
  #swagger.tags = ["Categories"]
  */
);

router.post(
  "/categories",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  categoryController.create
  /*
  #swagger.tags = ["Categories"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/CreateCategoryRequest'}
  }
  */
);

router.put(
  "/categories/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  categoryController.update
  /*
  #swagger.tags = ["Categories"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/UpdateCategoryRequest'}
  }
  */
);

router.delete(
  "/categories/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  categoryController.remove
  /*
  #swagger.tags = ["Categories"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  */
);

router.get(
  "/books",
  bookController.findAll
  /*
  #swagger.tags = ["Books"]
  #swagger.parameters['search'] = { in: 'query', type: 'string' }
  #swagger.parameters['categoryId'] = { in: 'query', type: 'integer' }
  #swagger.parameters['page'] = { in: 'query', type: 'integer' }
  #swagger.parameters['limit'] = { in: 'query', type: 'integer' }
  */
);

router.get(
  "/books/:id",
  bookController.findOne
  /*
  #swagger.tags = ["Books"]
  */
);

router.post(
  "/books",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  bookController.create
  /*
  #swagger.tags = ["Books"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/CreateBookRequest'}
  }
  */
);

router.put(
  "/books/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  bookController.update
  /*
  #swagger.tags = ["Books"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/UpdateBookRequest'}
  }
  */
);

router.delete(
  "/books/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  bookController.remove
  /*
  #swagger.tags = ["Books"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  */
);

// Loans
router.post(
  "/loans",
  [authMiddleware, aclMiddleware([Role.MEMBER])],
  loanController.create
  /*
  #swagger.tags = ["Loans"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/CreateLoanRequest'}
  }
  */
);

router.get(
  "/loans/my",
  authMiddleware,
  loanController.findMyLoans
  /*
  #swagger.tags = ["Loans"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.parameters['search'] = { in: 'query', type: 'string' }
  #swagger.parameters['page'] = { in: 'query', type: 'integer' }
  #swagger.parameters['limit'] = { in: 'query', type: 'integer' }
  #swagger.parameters['status'] = { in: 'query', type: 'string' }
  */
);

router.get(
  "/loans",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  loanController.findAll
  /*
  #swagger.tags = ["Loans"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.parameters['search'] = { in: 'query', type: 'string' }
  #swagger.parameters['status'] = { in: 'query', type: 'string' }
  */
);

router.get(
  "/loans/export/pdf",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  loanController.exportPdf
  /*
  #swagger.tags = ["Loans"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  */
);

router.patch(
  "/loans/:id/approve",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  loanController.approve
  /*
  #swagger.tags = ["Loans"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  */
);

router.patch(
  "/loans/:id/reject",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  loanController.reject
  /*
  #swagger.tags = ["Loans"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/RejectLoanRequest'}
  }
  */
);

router.patch(
  "/loans/:id/return",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  loanController.returnLoan
  /*
  #swagger.tags = ["Loans"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/ReturnLoanRequest'}
  }
  */
);

// Dashboard
router.get(
  "/dashboard/stats",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  dashboardController.getStats
  /*
  #swagger.tags = ["Dashboard"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.responses[200] = {
    description: "Statistik dashboard admin",
    schema: {
      data: {$ref: '#/components/schemas/AdminDashboardStats'}
    }
  }
  */
);

router.get(
  "/dashboard/my-stats",
  authMiddleware,
  dashboardController.getMyStats
  /*
  #swagger.tags = ["Dashboard"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.responses[200] = {
    description: "Statistik dashboard member",
    schema: {
      data: {$ref: '#/components/schemas/MemberDashboardStats'}
    }
  }
  */
);

// Users Management (Admin Only)
router.get(
  "/users",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  userController.findAll
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.parameters['search'] = { in: 'query', type: 'string' }
  #swagger.parameters['page'] = { in: 'query', type: 'integer' }
  #swagger.parameters['limit'] = { in: 'query', type: 'integer' }
  */
);

router.post(
  "/users",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  userController.create
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/CreateUserRequest'}
  }
  */
);

router.post(
  "/users/import",
  [authMiddleware, aclMiddleware([Role.ADMIN]), uploadExcel],
  userController.importExcel
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.requestBody = {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            file: {
              type: "string",
              format: "binary"
            }
          }
        }
      }
    }
  }
  */
);

router.put(
  "/users/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  userController.update
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/UpdateUserRequest'}
  }
  */
);

router.delete(
  "/users/:id",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  userController.remove
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  */
);

router.patch(
  "/users/change-password",
  authMiddleware,
  userController.changePassword
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/ChangePasswordRequest'}
  }
  */
);

router.patch(
  "/users/:id/reset-password",
  [authMiddleware, aclMiddleware([Role.ADMIN])],
  userController.resetPassword
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.responses[200] = {
    description: "Kata sandi berhasil direset",
    schema: {
      data: {$ref: '#/components/schemas/ResetPasswordResponse'}
    }
  }
  */
);

export default router;
