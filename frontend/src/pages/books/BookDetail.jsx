import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import { useAuth } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useEffect } from "react";

export default function BookDetail() {
  const { id } = useParams(); // Dành cho trường hợp /book/:id
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  const book = state?.book || null;

  useEffect(() => {
    if (!book && !id) {
      // Nếu không có dữ liệu, quay lại trang chủ
      navigate("/");
    }
  }, [book, id, navigate]);

  const handleAddToCart = () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập trước khi mua sách!");
      navigate("/login");
      return;
    }
    dispatch(addToCart(book));
    alert(`Đã thêm "${book.title}" vào giỏ hàng!`);
  };

  const handleBorrow = () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để mượn sách!");
      navigate("/login");
      return;
    }
    navigate("/borrow", { state: { book } });
  };

  return (
    <section className="max-w-4xl mx-auto">
      {book ? (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 h-[380px] overflow-hidden rounded-lg border border-slate-200">
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
                <p>
                  <span className="font-medium">Tác giả:</span> {book.author || "Không rõ"}
                </p>
                <p>
                  <span className="font-medium">Thể loại:</span> {book.category || "Chưa phân loại"}
                </p>
                <p>
                  <span className="font-medium">Tình trạng:</span> Sẵn sàng
                </p>
                <p>
                  <span className="font-medium">Giá bán:</span>{" "}
                  <span className="text-primary font-semibold">
                    {book.price ? `${book.price.toLocaleString()}đ` : "Liên hệ"}
                  </span>
                </p>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleAddToCart}
                  className="bg-primary text-black font-semibold px-5 py-2 rounded-md hover:opacity-90 transition"
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleBorrow}
                  className="border border-primary text-primary px-5 py-2 rounded-md hover:bg-primary hover:text-black transition"
                >
                  Mượn sách
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
      ) : (
        <p className="text-center text-slate-600 mt-10">
          Đang tải thông tin sách...
        </p>
      )}
    </section>
  );
}
