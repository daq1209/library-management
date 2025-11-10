import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart, decrementQty } from "../../redux/features/cart/cartSlice.js";
import { getImgUrl } from "../../utils/getImgUrl";

const money = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "đ";

export default function CartPage() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const handleAddMore = (book) => dispatch(addToCart(book));
  const handleDecrease = (id) => dispatch(decrementQty(id));

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.newPrice || 0) * (item.quantity || 1),
    0
  );

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-display font-bold text-slate-800 mb-8">
        Giỏ hàng của bạn
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-600 mb-4">Giỏ hàng đang trống.</p>
          <Link
            to="/"
            className="inline-block bg-primary text-black px-5 py-2 rounded-md hover:opacity-90 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((book) => {
            const qty = book.quantity || 1;
            const unit = book.newPrice || 0;
            const line = unit * qty;

            return (
              <div
                key={book._id}
                className="flex flex-col sm:flex-row items-center gap-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <img
                  src={getImgUrl(book.coverImage)}
                  alt={book.title}
                  className="w-28 h-36 object-cover rounded-md border"
                />

                <div className="flex-1 w-full">
                  <h2 className="text-lg font-semibold text-slate-800 mb-1">
                    {book.title}
                  </h2>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-2">
                    {book.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                    <span>
                      <span className="font-medium">Đơn giá:</span> {money(unit)}
                    </span>
                    <span>
                      <span className="font-medium">Số lượng:</span> {qty}
                    </span>
                    <span className="text-primary font-semibold">
                      Thành tiền: {money(line)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* Thêm 1 cuốn giống hệt */}
                  <button
                    onClick={() => handleAddMore(book)}
                    className="bg-primary text-black font-semibold px-4 py-2 rounded-md hover:opacity-90 transition"
                  >
                    Thêm
                  </button>

                  {/* Giảm 1; nếu về 0 sẽ bị loại khỏi giỏ */}
                  <button
                    onClick={() => handleDecrease(book._id)}
                    className="border border-red-500 text-red-500 font-semibold px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}

          {/* Tổng tiền + Hành động */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-top pt-6">
            <p className="text-lg font-semibold text-slate-800">
              Tổng cộng: <span className="text-primary">{money(totalPrice)}</span>
            </p>
            <div className="flex gap-3">
              <Link
                to="/"
                className="px-6 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Tiếp tục mua sắm
              </Link>
              <Link
                to="/checkout"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              >
                Đi tới thanh toán
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
