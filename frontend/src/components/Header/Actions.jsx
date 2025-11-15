/**
 * Header Actions Component
 * 
 * Shows:
 * - Wishlist icon
 * - Cart icon with count badge
 * - User menu (dropdown) when signed in, or Login button when signed out
 */

import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { HiOutlineHeart, HiOutlineShoppingCart, HiOutlineUser } from "react-icons/hi2";
import { LuUser, LuPackage, LuHeart, LuLogOut, LuChevronDown } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";

export default function Actions({ cartCount = 0 }) {
  const { user, logout, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Debug log
  console.log('🔍 Actions - User:', user, 'isLoading:', isLoading);

  const displayCount = cartCount > 99 ? "99+" : cartCount;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Get first name for greeting
  const getFirstName = (name) => {
    if (!name) return "Bạn";
    return name.split(" ")[0];
  };

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleMenuClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Wishlist */}
      <Link to="/wishlist" aria-label="Yêu thích" className="relative">
        <div className="w-9 h-9 rounded-full grid place-items-center bg-slate-100 hover:bg-slate-200 transition-transform transform-gpu hover:scale-105 active:scale-95">
          <HiOutlineHeart className="w-5 h-5 text-slate-700" />
        </div>
      </Link>

      {/* Cart */}
      <Link to="/cart" aria-label="Giỏ hàng" className="relative">
        <div className="w-9 h-9 rounded-full grid place-items-center bg-slate-100 hover:bg-slate-200 transition-transform transform-gpu hover:scale-105 active:scale-95">
          <HiOutlineShoppingCart className="w-5 h-5 text-slate-700" />
        </div>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 text-[11px] leading-5 rounded-full bg-primary text-black flex items-center justify-center px-1">
            {displayCount}
          </span>
        )}
      </Link>

      {/* User Menu */}
      <div className="relative" ref={dropdownRef}>
        {isLoading ? (
          // Loading skeleton
          <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse"></div>
        ) : user ? (
          // Signed-in: User chip with dropdown
          <>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all transform hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Menu người dùng"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                {getInitials(user.name)}
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                Chào, {getFirstName(user.name)}
              </span>
              <LuChevronDown
                className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-slideDown">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    onClick={() => handleMenuClick("/profile")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LuUser className="w-4 h-4 text-gray-400" />
                    Hồ sơ
                  </button>

                  <button
                    onClick={() => handleMenuClick("/orders")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LuPackage className="w-4 h-4 text-gray-400" />
                    Đơn hàng
                  </button>

                  <button
                    onClick={() => handleMenuClick("/wishlist")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LuHeart className="w-4 h-4 text-gray-400" />
                    Yêu thích
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LuLogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Signed-out: Login button
          <Link to="/login" aria-label="Đăng nhập">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-sm">
              <HiOutlineUser className="w-5 h-5" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

// Add animation styles to index.css
const styles = `
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}
`;
