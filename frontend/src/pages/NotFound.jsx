import { useRouteError, Link } from "react-router-dom";

export default function NotFound() {
  const err = useRouteError?.() || null;
  const status = err?.status || 404;
  const message = err?.statusText || "Không tìm thấy trang";

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-bold text-blue-600">{status}</h1>
        <p className="text-slate-600">{message}</p>
        <Link to="/" className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white">
          Về Trang chủ
        </Link>
      </div>
    </div>
  );
}
