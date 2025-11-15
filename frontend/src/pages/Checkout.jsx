// frontend/src/pages/Checkout.jsx
import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImgUrl } from "../utils/getImgUrl";
import { clearCartAPI } from "../utils/cartAPI";
import { setCartBooks } from "../redux/features/cart/cartSlice";

const money = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  }) + "đ";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cartItems } = useSelector((state) => state.cart);

  const [fullName, setFullName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.newPrice || 0) * (item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cartItems]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems.length) {
      alert("Giỏ hàng đang trống, không thể thanh toán.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Sau này có thể thay bằng API tạo 'order'
      await clearCartAPI(); // Clear trên backend (demo)
      dispatch(setCartBooks([])); // Clear trên frontend

      // Điều hướng sang trang thanh toán thành công
      navigate("/payment-success", {
        replace: true,
        state: {
          totalPrice,
          totalItems,
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Thanh toán thất bại, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nếu không có item nào trong giỏ, hiển thị thông báo
  if (!cartItems.length) {
    return (
      <section className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
          Thanh toán
        </h1>
        <p className="text-slate-600 mb-6">
          Hiện tại giỏ hàng của bạn đang trống. Hãy thêm sách trước khi thanh toán.
        </p>
        <Link
          to="/cart"
          className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:opacity-90 transition"
        >
          Quay lại giỏ hàng
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
        Thanh toán
      </h1>
      <p className="text-slate-600 mb-8">
        Kiểm tra lại đơn hàng và điền thông tin nhận sách của bạn.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-8">
        {/* Form thông tin người nhận */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-1">
            Thông tin người nhận
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Các thông tin này dùng để liên hệ khi chuẩn bị sách cho bạn.
          </p>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Họ và tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Nhập họ tên của bạn"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Địa chỉ / Ghi chú nhận sách
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
              placeholder="Ví dụ: Nhận sách tại quầy, tầng 2 thư viện, khung giờ 9h–11h..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Ghi chú thêm (không bắt buộc)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
              placeholder="Ghi chú cho thủ thư nếu cần..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Phương thức thanh toán
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
            >
              <option value="cod">Thanh toán khi nhận sách (COD)</option>
              <option value="transfer">Chuyển khoản ngân hàng</option>
              <option value="wallet">Ví điện tử (demo)</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Hiện tại đây là trang demo, chưa kết nối cổng thanh toán thật.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 mt-4">
            <Link
              to="/cart"
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 transition"
            >
              Quay lại giỏ hàng
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </button>
          </div>
        </form>

        {/* Tóm tắt đơn hàng */}
        <aside className="bg-slate-50 border border-slate-200 rounded-xl p-6 h-max">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Tóm tắt đơn hàng
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 bg-white rounded-md border border-slate-200 p-3"
              >
                <img
                  src={getImgUrl(item.cover)}
                  alt={item.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    Số lượng: {item.quantity || 1}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {money((item.newPrice || 0) * (item.quantity || 1))}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-1 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Tổng số lượng</span>
              <span>{totalItems} cuốn</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí mượn</span>
              <span>0đ</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phụ phí</span>
              <span>0đ</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-slate-800 pt-2 border-t border-slate-200 mt-2">
              <span>Thành tiền</span>
              <span className="text-primary">{money(totalPrice)}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            * Đây là trang demo để trình bày luồng thanh toán. Khi kết nối backend
            đầy đủ, thao tác xác nhận sẽ tạo một bản ghi đơn hàng kèm trạng thái
            ban đầu là <strong>PENDING</strong>.
          </p>
        </aside>
      </div>
    </section>
  );
}
