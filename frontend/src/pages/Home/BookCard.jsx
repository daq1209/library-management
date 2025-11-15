import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, setCartBooks } from '../../redux/features/cart/cartSlice';
import { getImgUrl } from '../../utils/getImgUrl';
import { useAuth } from '../../context/AuthContext';
import { addToCartAPI, getCartAPI } from '../../utils/cartAPI';
import { getBooks } from '../../utils/booksCatalog';
import { useToast } from '../../context/ToastContext';

export default function BookCard({ book, eager = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handlers
  // Wishlist UI removed as per requirements

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
    // Subtle feedback
    const btn = e.currentTarget;
    btn.classList.add('scale-95');
    setTimeout(() => btn.classList.remove('scale-95'), 150);
  };

  const handleBorrow = (e) => {
    e.stopPropagation();
    navigate('/borrow', { state: { book } });
  };

  const handleNavigateToDetail = () => {
    navigate(`/book/${book._id}`, { state: { book } });
  };

  // Format price
  const displayPrice = book.newPrice
    ? book.newPrice.toLocaleString('vi-VN') + 'đ'
    : 'Liên hệ';

  return (
    <div
      className="
        group relative rounded-xl border bg-white overflow-hidden
        hover:shadow-md transition-shadow duration-300
        focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
      "
    >
      {/* Wishlist icon removed */}

      {/* Image - Clickable */}
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
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setImageLoaded(true)}
          className={`
            w-full h-full object-cover rounded-t-xl
            group-hover:scale-105 transition-transform duration-500
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        />
        
        {/* Bestseller Badge - Bottom Left on Image */}
        {book.trending && (
          <div className="absolute bottom-2 left-2">
            <span className="inline-block text-[11px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
              Bestseller
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Title - Clickable */}
        <h3
          onClick={handleNavigateToDetail}
          className="text-sm font-semibold text-slate-900 line-clamp-1 cursor-pointer hover:text-primary transition-colors"
        >
          {book.title}
        </h3>

        {/* Price */}
        <p className="text-base font-bold text-slate-900">
          {displayPrice}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="
              flex-1 bg-primary text-black text-sm font-medium px-3 py-1.5 rounded-md
              hover:bg-primary/90 transition-all duration-150
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
            "
          >
            Giỏ
          </button>
          <button
            onClick={handleBorrow}
            aria-label="Mượn sách này"
            className="
              flex-1 border border-primary text-primary text-sm font-medium px-3 py-1.5 rounded-md
              hover:bg-primary hover:text-black transition-all duration-150
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
            "
          >
            Mượn
          </button>
        </div>
      </div>
    </div>
  );
}
