// backend/src/routes/admin.routes.js
import express from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  adminCreateUserSchema,
  adminUpdateUserRoleSchema,
  adminUpdateUserStatusSchema,
  adminGetLogsQuerySchema,
  validate,
} from "../schemas/admin.schema.js";

import {
  getAllUsers,
  createUserByAdmin,
  updateUserRole,
  updateUserStatus,
  getLogs,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Middleware: yêu cầu đã đăng nhập + role admin
router.use(authenticate, (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
});

// Users
router.get("/users", getAllUsers);
router.post("/users", validate(adminCreateUserSchema), createUserByAdmin);
router.patch(
  "/users/:id/role",
  validate(adminUpdateUserRoleSchema),
  updateUserRole
);
router.patch(
  "/users/:id/status",
  validate(adminUpdateUserStatusSchema),
  updateUserStatus
);

// Logs
router.get("/logs", (req, res, next) => {
  try {
    adminGetLogsQuerySchema.parse(req.query);
    next();
  } catch (err) {
    next(err);
  }
}, getLogs);

export default router;
