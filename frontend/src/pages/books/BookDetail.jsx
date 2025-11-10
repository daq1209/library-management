import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice.js";
import { addToWishlist } from "../../redux/features/wishlist/wishlistSlice.js";
import { getImgUrl } from "../../utils/getImgUrl";
import { useAuth } from "../../context/AuthContext";

export default function BookDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  const book = state?.book || null;

  useEffect(() => {
    if (!book && !id) navigate("/", { replace: true });
  }, [book, id, navigate]);

  const handleBuyNow = () => {
    if (!book) return;
    dispatch(addToCart(book));
    navigate("/cart");
  };

  const handleBorrow = () => {
    if (!book) return;
    if (!currentUser) {
      alert("Vui lòng đăng nhập để mượn sách!");
      navigate("/login");
      return;
    }
    navigate("/borrow", { state: { book } });
  };

  const handleAddWishlist = () => {
    if (!book) return;
    dispatch(addToWishlist(book));
  };

  if (!book) {
    return (
      <section className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-slate-800">Đang tải thông tin sách…</h1>
        <Link to="/" className="btn-primary inline-block mt-6">Về trang chủ</Link>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 h-[380px] overflow-hidden rounded-lg border relative">
            <img
              src={getImgUrl(book.coverImage)}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-3">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800">
              {book.title}
            </h1>

            <p className="text-slate-600 leading-relaxed">{book.description}</p>

            <div className="text-sm text-slate-700 space-y-1">
              <p><span className="font-medium">Tác giả:</span> {book.author || "Không rõ"}</p>
              <p><span className="font-medium">Thể loại:</span> {book.category || "Chưa phân loại"}</p>
              <p><span className="font-medium">Tình trạng:</span> Sẵn sàng</p>
              <p>
                <span className="font-medium">Giá bán:</span>{" "}
                <span className="text-primary font-semibold">
                  {book.newPrice != null ? `$${book.newPrice}` : "Liên hệ"}
                </span>
                {book.oldPrice && (
                  <span className="ml-2 line-through text-slate-400">
                    ${book.oldPrice}
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              <button
                onClick={handleBuyNow}
                className="bg-primary text-black font-semibold px-5 py-2 rounded-md hover:opacity-90 transition"
              >
                Mua ngay
              </button>
              <button
                onClick={handleBorrow}
                className="border border-primary text-primary px-5 py-2 rounded-md hover:bg-primary hover:text-black transition"
              >
                Mượn sách (0đ)
              </button>
              <button
                onClick={handleAddWishlist}
                className="border border-slate-300 text-slate-700 px-5 py-2 rounded-md hover:bg-slate-50 transition"
              >
                Thêm vào Wishlist
              </button>
            </div>

            <div className="mt-4">
              <Link
                to="/"
                className="inline-block text-sm text-slate-600 hover:text-primary transition"
              >
                ← Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
