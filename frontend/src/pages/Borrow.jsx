import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImgUrl } from "../utils/getImgUrl";

export default function Borrow() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const book = state?.book || null;

  useEffect(() => {
    if (!book) navigate("/", { replace: true });
  }, [book, navigate]);

  if (!book) return null;

  const handleSendBorrowRequest = async () => {
    // TODO: khi có backend -> gọi API tạo borrow-request
    alert(`Đã ghi nhận yêu cầu mượn "${book?.title}". Phí: 0đ.`);
    navigate("/", { replace: true });
  };

  return (
    <section className="max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mb-4">
        Mượn sách (Phí: 0đ)
      </h1>

      {!currentUser ? (
        <div className="mb-4 p-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800">
          Bạn cần{" "}
          <Link to="/login" className="underline font-medium">
            đăng nhập
          </Link>{" "}
          để mượn sách.
        </div>
      ) : (
        <div className="mb-4 text-sm text-slate-700">
          Đăng nhập với:{" "}
          <span className="font-medium">{currentUser.email}</span>
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

            <div className="mt-3 space-y-1 text-sm text-slate-700">
              <div>
                <span className="font-medium">Mã sách:</span>{" "}
                {book?._id || "—"}
              </div>
              <div>
                <span className="font-medium">Tình trạng:</span> Sẵn sàng mượn
              </div>
              <div>
                <span className="font-medium">Phí mượn:</span>{" "}
                <span className="text-green-600 font-bold">0đ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            disabled={!currentUser}
            onClick={handleSendBorrowRequest}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Gửi yêu cầu mượn (0đ)
          </button>
          <Link
            to="/"
            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </Link>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        * Khi tích hợp backend, thao tác này sẽ tạo yêu cầu mượn (trạng thái{" "}
        <strong>PENDING</strong>).
      </p>
    </section>
  );
}
