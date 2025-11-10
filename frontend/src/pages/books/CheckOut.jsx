import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getImgUrl } from "../../utils/getImgUrl";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const book = state?.book || null;
  const borrowFee = 0; // phí mượn sách = 0đ

  useEffect(() => {
    // Nếu không có book truyền vào, quay về trang chủ
    if (!book) navigate("/", { replace: true });
  }, [book, navigate]);

  if (!book) return null;

  const handleConfirmBorrow = async (e) => {
    e.preventDefault();
    // TODO: sau này thay bằng gọi API backend tạo borrow-request
    alert(`Yêu cầu mượn sách "${book?.title}" đã được ghi nhận. Phí: 0đ.`);
    navigate("/", { replace: true });
  };

  return (
    <section className="max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mb-4">
        Xác nhận mượn sách
      </h1>

      {!currentUser && (
        <div className="mb-4 p-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800">
          Bạn chưa đăng nhập. <Link to="/login" className="underline font-medium">Đăng nhập</Link> để mượn sách nhanh hơn.
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="w-28 h-40 shrink-0 overflow-hidden rounded border">
            <img
              src={getImgUrl(book?.coverImage)}
              alt={book?.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-800 line-clamp-2">
              {book?.title}
            </h2>
            <p className="text-sm text-slate-600 line-clamp-3 mt-1">
              {book?.description}
            </p>

            <div className="mt-3 space-y-1">
              <div className="text-sm text-slate-700">
                <span className="font-medium">Tài khoản:</span>{" "}
                {currentUser?.email || "Khách chưa đăng nhập"}
              </div>
              <div className="text-sm text-slate-700">
                <span className="font-medium">Mã sách:</span> {book?._id || "—"}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="flex items-center justify-between">
          <span className="text-slate-700">Phí mượn sách</span>
          <span className="text-xl font-bold text-green-600">
            {borrowFee.toLocaleString("vi-VN")}đ
          </span>
        </div>

        <form onSubmit={handleConfirmBorrow} className="mt-6 flex gap-3">
          <button
            type="submit"
            className="btn-primary"
            aria-label="Xác nhận mượn sách"
          >
            Xác nhận mượn (0đ)
          </button>
          <Link
            to="/"
            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </Link>
        </form>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        * Sau này khi kết nối backend, thao tác này sẽ tạo <em>borrow request</em> ở hệ thống, trạng thái ban đầu là <strong>PENDING</strong>.
      </p>
    </section>
  );
}
