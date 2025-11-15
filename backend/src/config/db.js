// backend/src/config/db.js
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn tới file db.json
const file = path.join(__dirname, "../../db/db.json");
const adapter = new JSONFile(file);

// Cấu trúc default của database
const defaultData = {
  users: [],
  tokens: [],
  wishlists: [],
  carts: [],
  logs: [], // ✅ collection cho nhật ký hệ thống
};

const db = new Low(adapter, defaultData);

/**
 * Hàm khởi tạo DB – dùng cho cả app.js và seed.js
 */
export async function initDB() {
  // đọc file hiện tại
  await db.read();

  // nếu file trống thì gán default
  db.data ||= defaultData;

  // đảm bảo luôn có đủ các key (phòng khi file cũ chưa có logs)
  db.data.users ||= [];
  db.data.tokens ||= [];
  db.data.wishlists ||= [];
  db.data.carts ||= [];
  db.data.logs ||= [];

  // ghi lại nếu cần
  await db.write();
}

// Gọi initDB một lần khi module được load (để app.js dùng cho tiện)
await initDB();

export default db;
