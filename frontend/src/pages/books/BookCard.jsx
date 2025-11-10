import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl.js";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice.js";

export default function BookCard({ book }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(book));
    alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Ảnh sách */}
      <Link
        to={`/book/${book._id}`}
        state={{ book }}
        className="block overflow-hidden"
      >
        <img
          src={getImgUrl(book.coverImage)}
          alt={book.title}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-4 space-y-2">
        {/* Tiêu đề */}
        <Link
          to={`/book/${book._id}`}
          state={{ book }}
          className="block text-lg font-semibold text-slate-800 hover:text-primary transition-colors line-clamp-2"
        >
          {book.title}
        </Link>

        {/* Mô tả ngắn */}
        <p className="text-sm text-slate-600 line-clamp-3">{book.description}</p>

        {/* Giá và nút hành động */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-primary font-bold">
            {book.newPrice ? `${book.newPrice.toLocaleString()}đ` : "Liên hệ"}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="bg-primary text-black px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition"
            >
              Mua
            </button>

            <Link
              to="/borrow"
              state={{ book }}
              className="border border-primary text-primary px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary hover:text-black transition"
            >
              Mượn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
