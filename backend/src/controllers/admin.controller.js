// backend/src/controllers/admin.controller.js
import { randomUUID } from "crypto";
import db from "../config/db.js";
import { hashPassword } from "../utils/hash.js";
import { ApiError } from "../middlewares/error.js";
import { addLog } from "../utils/logger.js";

/**
 * GET /api/v1/admin/users
 */
export async function getAllUsers(req, res, next) {
  try {
    db.data.users ||= [];

    const users = db.data.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status || "active",
      createdAt: u.createdAt,
    }));

    return res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/admin/users
 * Admin tạo user mới
 */
export async function createUserByAdmin(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    db.data.users ||= [];
    const existing = db.data.users.find((u) => u.email === email);
    if (existing) {
      throw new ApiError(400, "Email already registered");
    }

    const passwordHash = await hashPassword(password);

    const newUser = {
      id: randomUUID(),
      name,
      email,
      passwordHash,
      role: role || "reader",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    db.data.users.push(newUser);
    await db.write();

    await addLog({
      actorId: req.user.userId,
      actorEmail: req.user.email,
      action: `Admin created user ${email} with role ${newUser.role}`,
      meta: { userId: newUser.id, role: newUser.role },
    });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userResponse,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/admin/users/:id/role
 */
export async function updateUserRole(req, res, next) {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    db.data.users ||= [];
    const user = db.data.users.find((u) => u.id === userId);
    if (!user) throw new ApiError(404, "User not found");

    const oldRole = user.role;
    user.role = role;
    await db.write();

    await addLog({
      actorId: req.user.userId,
      actorEmail: req.user.email,
      action: `Changed role of ${user.email} from ${oldRole} to ${role}`,
      meta: { userId: user.id, oldRole, newRole: role },
    });

    return res.json({
      success: true,
      message: "Role updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || "active",
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/admin/users/:id/status
 */
export async function updateUserStatus(req, res, next) {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    db.data.users ||= [];
    const user = db.data.users.find((u) => u.id === userId);
    if (!user) throw new ApiError(404, "User not found");

    const oldStatus = user.status || "active";
    user.status = status;
    await db.write();

    await addLog({
      actorId: req.user.userId,
      actorEmail: req.user.email,
      action: `Changed status of ${user.email} from ${oldStatus} to ${status}`,
      meta: { userId: user.id, oldStatus, newStatus: status },
    });

    return res.json({
      success: true,
      message: "Status updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/admin/logs
 */
export async function getLogs(req, res, next) {
  try {
    db.data.logs ||= [];

    const limitRaw = req.query.limit;
    let limit = 50;
    if (limitRaw && !Number.isNaN(Number(limitRaw))) {
      limit = Math.max(1, Math.min(200, Number(limitRaw)));
    }

    const logs = db.data.logs.slice(0, limit);

    return res.json({
      success: true,
      logs,
    });
  } catch (err) {
    next(err);
  }
}
