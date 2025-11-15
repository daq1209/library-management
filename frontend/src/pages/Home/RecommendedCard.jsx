import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineHeart, HiHeart, HiShoppingCart, HiBookOpen } from "react-icons/hi2";
import { addToCart, setCartBooks } from "../../redux/features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../redux/features/wishlist/wishlistSlice";
import { getImgUrl } from "../../utils/getImgUrl";
import { useAuth } from "../../context/AuthContext";
import { addToCartAPI, getCartAPI } from "../../utils/cartAPI";
import { getBooks } from "../../utils/booksCatalog";
import { useToast } from "../../context/ToastContext";

export default function RecommendedCard({ book, index = 0, eager = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  // const wishlistItems = useSelector((state) => state.wishlist.items);
  // const isInWishlist = wishlistItems.some((item) => item._id === book._id);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Wishlist logic removed

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để sử dụng Giỏ hàng', 'warning');
      navigate('/login');
      return;
    }
    try {
      await addToCartAPI(book._id, 1);
      dispatch(addToCart(book));
      // Refetch cart to sync
      const [resp, books] = await Promise.all([getCartAPI(), getBooks()]);
      const items = resp.data.items || [];
      const mapped = items.map(({ bookId, qty }) => {
        const b = books.find(x => String(x._id) === String(bookId));
        return b ? { ...b, quantity: qty || 1 } : null;
      }).filter(Boolean);
      dispatch(setCartBooks(mapped));
      showToast('✨ Đã thêm vào giỏ hàng', 'success');
    } catch (err) {
      showToast('Không thể thêm vào giỏ hàng', 'error');
    }
    const btn = e.currentTarget;
    btn.classList.add("scale-95");
    setTimeout(() => btn.classList.remove("scale-95"), 150);
  };

  const handleBorrow = (e) => {
    e.stopPropagation();
    navigate("/borrow", { state: { book } });
  };

  const handleNavigateToDetail = () => {
    navigate(`/book/${book._id}`, { state: { book } });
  };

  // Format price
  const displayPrice = book.newPrice
    ? book.newPrice.toLocaleString("vi-VN") + "đ"
    : "Miễn phí mượn";

  return (
    <>
      <div
        className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200"
        style={{
          animation: `fadeInUp 0.4s ease-out ${index * 0.04}s both`,
        }}
      >
        {/* Wishlist icon removed */}

        {/* Image */}
        <div
          onClick={handleNavigateToDetail}
          className="relative h-64 bg-slate-100 cursor-pointer overflow-hidden"
        >
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-slate-200" />
          )}
          <img
            src={getImgUrl(book.coverImage)}
            alt={book.title}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-200 group-hover:scale-103 group-hover:-translate-y-0.5 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h3
            onClick={handleNavigateToDetail}
            className="text-sm font-semibold text-slate-800 line-clamp-1 cursor-pointer group-hover:text-primary transition-colors duration-150"
          >
            {book.title}
          </h3>

          {/* Description */}
          {book.description && (
            <p className="text-[13px] text-slate-600 line-clamp-2 leading-relaxed">
              {book.description}
            </p>
          )}

          {/* Price */}
          <p className="text-base font-bold text-slate-900">{displayPrice}</p>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-black text-sm font-medium px-3 py-1.5 rounded-md hover:opacity-90 transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <HiShoppingCart className="w-4 h-4" />
              <span>Giỏ</span>
            </button>
            <button
              onClick={handleBorrow}
              aria-label="Borrow this book"
              className="flex-1 flex items-center justify-center gap-1.5 border border-primary text-primary text-sm font-medium px-3 py-1.5 rounded-md hover:bg-primary hover:text-black transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <HiBookOpen className="w-4 h-4" />
              <span>Mượn</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 8px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .scale-103 {
          transform: scale(1.03);
        }
        .scale-95 {
          transform: scale(0.95);
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
}
