// frontend/src/utils/adminAPI.js
import { http } from "./http";

// Lấy danh sách user
export const adminGetUsers = () => http.get("/admin/users");

// Tạo user mới (sau này cần thì dùng)
export const adminCreateUser = (data) =>
  http.post("/admin/users", data);

// Cập nhật role user
export const adminUpdateUserRole = (userId, role) =>
  http.patch(`/admin/users/${userId}/role`, { role });

// Cập nhật trạng thái active / blocked
export const adminUpdateUserStatus = (userId, status) =>
  http.patch(`/admin/users/${userId}/status`, { status });

// Lấy nhật ký hệ thống
export const adminGetLogs = (limit = 50) =>
  http.get(`/admin/logs?limit=${limit}`);
