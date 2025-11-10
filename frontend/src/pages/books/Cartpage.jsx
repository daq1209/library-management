import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { FiShoppingCart } from "react-icons/fi";
import { addToCart } from "../../redux/features/cart/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.newPrice || 0),
    0
  );

  const handleAddAgain = (book) => {
    dispatch(addToCart(book));
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FiShoppingCart className="text-yellow-500" />
        Giỏ hàng của bạn
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-600 mb-3">
            Giỏ hàng của bạn đang trống.
          </p>
          <Link
            to="/"
            className="btn-primary inline-block"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-700">Sách</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-700">Giá</th>
                  <th className="py-3 px-4 text-sm font-semibold text-slate-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((book, idx) => (
                  <tr
                    key={book._id || idx}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-14 h-20 border rounded overflow-hidden">
                        <img
                          src={getImgUrl(book?.coverImage)}
                          alt={book?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-[15px] font-semibold text-slate-800">
                          {book?.title}
                        </h2>
                        <p className="text-xs text-slate-500 line-clamp-2 max-w-[250px]">
                          {book?.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      ${book?.newPrice}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleAddAgain(book)}
                        className="text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 rounded text-black font-semibold"
                      >
                        + Thêm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tổng cộng */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-lg font-semibold text-slate-700">
              Tổng cộng:
            </span>
            <span className="text-2xl font-bold text-green-600">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Điều hướng */}
          <div className="flex justify-end mt-6">
            <Link
              to="/checkout"
              className="btn-primary"
            >
              Thanh toán 
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
