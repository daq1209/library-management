// src/pages/Wishlist.jsx
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeFromWishlist,
  clearWishlist,
} from "../redux/features/wishlist/wishlistSlice.js";
import { addToCart } from "../redux/features/cart/cartSlice.js";
import { getImgUrl } from "../utils/getImgUrl";
import { useAuth } from "../context/AuthContext";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s) => s.wishlist.items);
  const { currentUser } = useAuth();

  const moveToCart = (book) => {
    dispatch(addToCart(book));
    dispatch(removeFromWishlist(book._id));
  };

  const handleBorrow = (book) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để mượn sách!");
      navigate("/login");
      return;
    }
    navigate("/borrow", { state: { book } });
  };

  if (items.length === 0) {
    return (
      <section className="max-w-5xl mx-auto py-10 px-4 text-center">
        <h1 className="text-3xl font-display font-bold text-slate-800 mb-3">
          Wishlist
        </h1>
        <p className="text-slate-600 mb-6">Danh sách trống.</p>
        <Link to="/" className="btn-primary inline-block">
          Tiếp tục xem sách
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold text-slate-800">
          Wishlist
        </h1>
        <button
          onClick={() => dispatch(clearWishlist())}
          className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="space-y-6">
        {items.map((book) => (
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
              <Link
                to={`/book/${book._id}`}
                state={{ book }}
                className="text-lg font-semibold text-slate-800 hover:text-primary"
              >
                {book.title}
              </Link>
              <p className="text-slate-600 text-sm line-clamp-2 mt-1">
                {book.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => moveToCart(book)}
                className="bg-primary text-black font-semibold px-4 py-2 rounded-md hover:opacity-90 transition"
              >
                Thêm vào giỏ
              </button>

              <button
                onClick={() => handleBorrow(book)}
                className="border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary hover:text-black transition"
              >
                Mượn sách 
              </button>

              <button
                onClick={() => dispatch(removeFromWishlist(book._id))}
                className="border border-red-500 text-red-500 font-semibold px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
