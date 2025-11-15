// frontend/src/routers/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();

  // Đang bootstrap từ localStorage / gọi /auth/me
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">
          Đang kiểm tra phiên đăng nhập...
        </p>
      </div>
    );
  }

  // Chưa đăng nhập -> đá về login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Có yêu cầu role mà không khớp -> đá về trang chủ
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  // Dùng dạng <PrivateRoute><Component /></PrivateRoute>
  if (children) return children;

  // Dùng dạng element: <PrivateRoute />, children: [...]
  return <Outlet />;
};

export default PrivateRoute;
