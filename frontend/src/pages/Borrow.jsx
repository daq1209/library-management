import { useMemo } from "react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImgUrl } from "../utils/getImgUrl";
import { FaHandHolding, FaCircleInfo } from "react-icons/fa6";

/**
 * Trang Borrow hỗ trợ 3 trường hợp:
 * 1) Đi từ BookCard (có state.book)  -> hiển thị chi tiết sách & nút gửi yêu cầu.
 * 2) Đi từ NavBar (không có state)   -> hiển thị hướng dẫn chọn sách để mượn.
 * 3) (tùy chọn) Có ?id=<bookId>      -> sau này có backend sẽ fetch theo id.
 */

export default function Borrow() {
  const { state } = useLocation();
  const { currentUser } = useAuth();
  const [params] = useSearchParams();

  // book từ state (đi từ BookCard)
  const bookFromState = state?.book || null;

  // (tùy chọn) bookId từ query ?id=... (để sau này fetch từ backend)
  const bookId = params.get("id");

  // Tạm thời ưu tiên state, chưa có backend nên không fetch theo id
  const book = useMemo(() => bookFromState, [bookFromState]);

  const handleSendBorrowRequest = async () => {
    // TODO: khi có backend -> gọi API tạo borrow-request
    alert(
      `Đã ghi nhận yêu cầu mượn "${book?.title || "(chưa chọn)"}". Phí: 0đ.`
    );
  };

  return (
    <section className="max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FaHandHolding className="text-primary" />
        Mượn sách (Phí: 0đ)
      </h1>

      {!currentUser ? (
        <div className="mb-4 p-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 flex items-start gap-2">
          <FaCircleInfo className="mt-0.5" />
          <span> Bạn cần <Link to="/login" className="underline font-medium">đăng nhập</Link> để mượn sách.</span>
        </div>
      ) : (
        <div className="mb-4 text-sm text-slate-700">
          Đăng nhập với: <span className="font-medium">{currentUser.email}</span>
        </div>
      )}

      {/* Nếu có book (đi từ BookCard) */}
      {book ? (
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
                <div><span className="font-medium">Mã sách:</span> {book?._id || "—"}</div>
                <div><span className="font-medium">Tình trạng:</span> Sẵn sàng mượn</div>
                <div><span className="font-medium">Phí mượn:</span> <span className="text-green-600 font-bold">0đ</span></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              disabled={!currentUser}
              onClick={handleSendBorrowRequest}
              className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Gửi yêu cầu mượn sách
            </button>
            <Link
              to="/"
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      ) : (
        // Nếu KHÔNG có book (đi từ NavBar)
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-slate-700">
            Bạn đang ở trang mượn sách. Vui lòng chọn sách để mượn bằng cách:
          </p>
          <ul className="list-disc pl-5 mt-3 text-slate-700 space-y-1">
            <li>Vào trang chủ và bấm nút <strong>Mượn</strong> trên sách bạn muốn.</li>
            <li>Hoặc sau này truy cập đường dẫn có dạng <code className="bg-slate-100 px-1 rounded">/borrow?id=&lt;bookId&gt;</code> khi backend đã hỗ trợ.</li>
          </ul>

          <div className="mt-5">
            <Link to="/" className="btn-primary">Xem danh sách sách</Link>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 mt-3">
        * Khi tích hợp backend, trang này sẽ hỗ trợ truyền <code>?id=</code> để tự động nạp sách.
      </p>
    </section>
  );
}
