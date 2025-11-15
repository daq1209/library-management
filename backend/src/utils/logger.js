// backend/src/utils/logger.js
import { randomUUID } from "crypto";
import db from "../config/db.js";

/**
 * Ghi một log hệ thống
 * @param {Object} options
 * @param {string} options.actorId
 * @param {string} options.actorEmail
 * @param {string} options.action
 * @param {Object} [options.meta]
 */
export async function addLog({ actorId, actorEmail, action, meta = {} }) {
  db.data.logs ||= [];

  const logEntry = {
    id: randomUUID(),
    actorId,
    actorEmail,
    action,
    meta,
    createdAt: new Date().toISOString(),
  };

  // Cho log mới lên đầu
  db.data.logs.unshift(logEntry);
  await db.write();

  console.log(`📝 LOG: ${actorEmail} - ${action}`);
}
