import { Link, useNavigate } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl.js";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist, setWishlistBooks } from "../../redux/features/wishlist/wishlistSlice.js";
import { addToWishlistAPI, removeFromWishlistAPI, toggleWishlistAPI, getWishlistAPI } from "../../utils/wishlistAPI";
import { useAuth } from "../../context/AuthContext.jsx";
import { getBooks } from "../../utils/booksCatalog.js";
import { useToast } from "../../context/ToastContext";

export default function BookCard({ book }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isInWishlist = wishlist.some((item) => item._id === book._id);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để sử dụng Wishlist', 'warning');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    try {
      // Always use string for bookId
      await toggleWishlistAPI(String(book._id));
      // Fetch updated wishlist from server
      const [resp, books] = await Promise.all([getWishlistAPI(), getBooks()]);
      const ids = resp.data.items || [];
      const mapped = ids.map(id => books.find(b => String(b._id) === String(id))).filter(Boolean);
      dispatch(setWishlistBooks(mapped));
      if (ids.map(String).includes(String(book._id))) {
        showToast('✨ Đã thêm vào Wishlist', 'success');
      } else {
        showToast('✓ Đã xóa khỏi Wishlist', 'info');
      }
    } catch (err) {
      showToast('Không thể cập nhật Wishlist. Vui lòng thử lại.', 'error');
    }
  };

  const handleBorrow = (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để mượn sách', 'warning');
      navigate("/login");
      return;
    }
    navigate("/borrow", { state: { book } });
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Ảnh + icon wishlist */}
      <div className="relative">
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

        {/* Icon trái tim wishlist */}
        {/*
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
        */}
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
        </div>

        {/* Hai nút hành động */}
        <div className="flex items-center justify-between mt-4">
          <Link
            to={`/book/${book._id}`}
            state={{ book }}
            className="bg-primary text-black px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            Thêm vào giỏ
          </Link>
          <button
            onClick={handleBorrow}
            className="border border-primary text-primary px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary hover:text-black transition"
          >
            Mượn sách
          </button>
        </div>
      </div>
    </div>
  );
}
