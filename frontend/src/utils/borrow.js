// Placeholder cho chức năng mượn sách — sau này sẽ kết nối API thật
export async function requestBorrowPlaceholder(payload) {
  console.log("[Borrow placeholder] payload:", payload);
  await new Promise((r) => setTimeout(r, 250)); // Giả lập delay mạng
  return { ok: true };
}

/*
// Khi có backend thật, chỉ cần sửa lại như sau:
import { http } from "./http";

export async function requestBorrow(payload) {
  const res = await http.post("/borrow-requests", payload);
  return res.data;
}
*/
