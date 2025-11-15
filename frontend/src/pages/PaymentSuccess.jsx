// frontend/src/pages/PaymentSuccess.jsx
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const formatMoney = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  }) + "đ";

export default function PaymentSuccess() {
  const location = useLocation();
  const { totalPrice, totalItems } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center text-center">
      {/* Icon thành công */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-300/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-9 h-9 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>
        <div className="absolute -inset-1 rounded-full border border-green-200/70 blur-[1px] pointer-events-none" />
      </div>

      {/* Tiêu đề + mô tả */}
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
        Thanh toán thành công ✔
      </h1>
      <p className="text-slate-600 max-w-xl mb-6">
        Cảm ơn bạn đã hoàn tất bước thanh toán / xác nhận mượn sách. Thông tin
        đơn sẽ được hệ thống lưu lại để thủ thư xử lý.
      </p>

      {/* Tóm tắt đơn hàng (nếu có state truyền sang) */}
      {(totalItems || totalPrice) && (
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4 mb-8 text-left">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Tóm tắt đơn của bạn
          </h2>
          <div className="space-y-1 text-sm">
            {totalItems && (
              <div className="flex justify-between text-slate-600">
                <span>Tổng số lượng sách</span>
                <span className="font-medium text-slate-800">
                  {totalItems} cuốn
                </span>
              </div>
            )}
            {totalPrice && (
              <div className="flex justify-between text-slate-600">
                <span>Thành tiền</span>
                <span className="font-semibold text-primary">
                  {formatMoney(totalPrice)}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            * Đây là trang demo, số liệu dùng để minh họa cho luồng thanh toán.
          </p>
        </div>
      )}

      {/* Nút điều hướng */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/orders"
          className="inline-flex items-center px-5 py-2.5 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
        >
          Xem lịch sử mượn / đơn hàng
        </Link>
        <Link
          to="/"
          className="inline-flex items-center px-5 py-2.5 rounded-md border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
        >
          Tiếp tục khám phá sách
        </Link>
      </div>

      <p className="text-xs text-slate-500 mt-6 max-w-md">
        Nếu có bất kỳ sai sót nào về thông tin đơn, bạn có thể liên hệ trực tiếp
        với thủ thư hoặc bộ phận hỗ trợ để được điều chỉnh.
      </p>
    </section>
  );
}
