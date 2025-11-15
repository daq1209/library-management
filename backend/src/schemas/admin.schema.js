// backend/src/schemas/admin.schema.js
import { z } from "zod";
export { validate } from "./auth.schema.js"; // dùng lại middleware validate đang có

// Admin tạo user mới
export const adminCreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "librarian", "reader"]).optional(), // mặc định reader
});

// Cập nhật role
export const adminUpdateUserRoleSchema = z.object({
  role: z.enum(["admin", "librarian", "reader"], {
    required_error: "Role is required",
  }),
});

// Cập nhật trạng thái active/blocked
export const adminUpdateUserStatusSchema = z.object({
  status: z.enum(["active", "blocked"], {
    required_error: "Status is required",
  }),
});

// (tạm đơn giản) validate limit trong query logs
export const adminGetLogsQuerySchema = z.object({
  limit: z.string().optional(),
});
