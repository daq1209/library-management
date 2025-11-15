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
import { getWishlistAPI, removeFromWishlistAPI } from "../utils/wishlistAPI";
import { addToCartAPI } from "../utils/cartAPI";
import { getBooks } from "../utils/booksCatalog";
import { setWishlistBooks } from "../redux/features/wishlist/wishlistSlice.js";
import { useEffect } from "react";
import { useToast } from "../context/ToastContext";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s) => s.wishlist.items);
  const { currentUser, isLoading } = useAuth();
  const { showToast } = useToast();
  
  console.log('🎯 Wishlist component rendered, items count:', items.length, 'currentUser:', !!currentUser, 'isLoading:', isLoading);
  
  // On mount: sync from server
  useEffect(() => {
    console.log('🔄 Wishlist useEffect triggered, currentUser:', !!currentUser, 'isLoading:', isLoading);
    
    // Wait for auth to finish loading
    if (isLoading) {
      console.log('⏳ Auth still loading, waiting...');
      return;
    }
    
    (async () => {
      if (!currentUser) {
        console.log('⚠️ No current user after auth loaded');
        return;
      }
      try {
        console.log('📡 Fetching wishlist from server...');
        const [resp, books] = await Promise.all([getWishlistAPI(), getBooks()]);
        console.log('📋 Wishlist API response:', resp.data);
        console.log('📚 Available books:', books.length);
        const ids = resp.data.items || [];
        console.log('🔍 Wishlist IDs from server:', ids);
        const mapped = ids.map(id => {
          const book = books.find(b => String(b._id) === String(id));
          console.log(`  Mapping ID ${id}:`, book ? `✓ ${book.title}` : '✗ Not found');
          if (!book) console.warn('⚠️ Book not found for ID:', id);
          return book;
        }).filter(Boolean);
        console.log('✅ Mapped books:', mapped.length, mapped);
        dispatch(setWishlistBooks(mapped));
        console.log('✅ Dispatched setWishlistBooks with', mapped.length, 'books');
      } catch (e) {
        console.error('❌ Failed to load wishlist:', e);
      }
    })();
  }, [currentUser, isLoading, dispatch]);

  const moveToCart = async (book) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để sử dụng Giỏ hàng', 'warning');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    try {
      await addToCartAPI(book._id, 1);
      dispatch(addToCart(book));
      await removeFromWishlistAPI(book._id);
      dispatch(removeFromWishlist(book._id));
    } catch (e) {
      console.warn('Cart/Wishlist sync failed', e);
    }
  };

  const handleBorrow = (book) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để mượn sách', 'warning');
      navigate("/login");
      return;
    }
    navigate("/borrow", { state: { book } });
  };

  if (items.length === 0) {
    return (
      <section className="max-w-5xl mx-auto py-10 px-4 text-center">
        <h1 className="text-3xl font-display font-bold text-slate-800 mb-3">
          Yêu thích
        </h1>
        <p className="text-slate-600 mb-6">Danh sách trống.</p>
        {/* Debug panel removed for production */}
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
          Yêu thích
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
                onClick={async () => {
                  try {
                    await removeFromWishlistAPI(book._id);
                  } catch (e) { /* ignore */ }
                  dispatch(removeFromWishlist(book._id));
                }}
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
