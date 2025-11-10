import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl.js";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2"; // thêm icon full
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../../redux/features/wishlist/wishlistSlice.js";
import { removeFromWishlist } from "../../redux/features/wishlist/wishlistSlice.js";

export default function BookCard({ book }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);

  // Kiểm tra xem sách này có trong wishlist không
  const isInWishlist = wishlist.some((item) => item._id === book._id);

  const toggleWishlist = (e) => {
    e.preventDefault(); // không mở link khi click icon
    if (isInWishlist) {
      dispatch(removeFromWishlist(book._id));
    } else {
      dispatch(addToWishlist(book));
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Ảnh + icon wishlist */}
      <div className="relative">
        <Link to={`/book/${book._id}`} state={{ book }} className="block overflow-hidden">
          <img
            src={getImgUrl(book.coverImage)}
            alt={book.title}
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Heart icon */}
        <button
          onClick={toggleWishlist}
          title={isInWishlist ? "Xóa khỏi Wishlist" : "Thêm vào Wishlist"}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow border transition-all"
        >
          {isInWishlist ? (
            <HiHeart className="w-5 h-5 text-red-500" />
          ) : (
            <HiOutlineHeart className="w-5 h-5 text-slate-700" />
          )}
        </button>
      </div>

      {/* Thông tin sách */}
      <div className="p-4 space-y-2">
        <Link
          to={`/book/${book._id}`}
          state={{ book }}
          className="block text-lg font-semibold text-slate-800 hover:text-primary transition-colors line-clamp-2"
        >
          {book.title}
        </Link>

        <p className="text-sm text-slate-600 line-clamp-3">{book.description}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="text-primary font-bold">
            {book.newPrice ? `${book.newPrice.toLocaleString()}đ` : "Liên hệ"}
          </div>

          <Link
            to={`/book/${book._id}`}
            state={{ book }}
            className="bg-primary text-black px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            Mua
          </Link>
        </div>
      </div>
    </div>
  );
}
