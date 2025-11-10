import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiMiniBars3CenterLeft,
  HiOutlineHeart,
  HiOutlineShoppingCart,
} from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const cartItems = useSelector((state) => state.cart.cartItems);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="relative max-w-screen-2xl mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          {/* Left: Logo + Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="main-menu"
              className="text-slate-700 hover:text-primary transition-colors"
            >
              <HiMiniBars3CenterLeft className="w-6 h-6" />
            </button>

            <Link
              to="/"
              className="text-xl font-display font-bold text-primary hover:text-yellow-400 transition-colors"
            >
              Library
            </Link>
          </div>

          {/* Middle: Search box */}
          <div className="hidden md:flex items-center bg-[#EAEAEA] rounded-md px-3 py-1 w-[220px] md:w-[260px]">
            <IoSearchOutline className="text-slate-600 text-lg mr-2" />
            <input
              type="text"
              placeholder="Search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent w-full text-sm focus:outline-none font-sans text-slate-700"
            />
          </div>

          {/* Right: User, Wishlist, Cart */}
          <div className="flex items-center gap-3">
            <Link
              to="/wishlist"
              className="hidden sm:inline-flex text-slate-700 hover:text-primary"
              aria-label="Wishlist"
            >
              <HiOutlineHeart className="w-6 h-6" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative bg-primary text-black rounded-sm px-3 py-1 flex items-center gap-1 hover:bg-primary-600 transition-colors"
              aria-label="Giỏ hàng"
            >
              <HiOutlineShoppingCart className="w-5 h-5" />
              {cartItems?.length > 0 && (
                <span className="text-sm font-semibold">{cartItems.length}</span>
              )}
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label="Tài khoản"
            >
              <HiOutlineUser className="w-5 h-5 text-slate-700" />
            </Link>
          </div>
        </nav>

        {menuOpen && (
          <div
            id="main-menu"
            className="absolute left-6 right-6 top-full mt-2 bg-white shadow-md rounded-md p-4 space-y-3"
          >
            <Link to="/" onClick={() => setMenuOpen(false)} className="block text-slate-700 font-medium hover:text-primary">Home</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="block text-slate-700 font-medium hover:text-primary">About</Link>
            <Link to="/orders" onClick={() => setMenuOpen(false)} className="block text-slate-700 font-medium hover:text-primary">Orders</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block text-slate-700 font-medium hover:text-primary">Cart</Link>
            <Link to="/borrow" onClick={() => setMenuOpen(false)} className="block text-slate-700 font-medium hover:text-primary">Mượn sách</Link>
          </div>
        )}
      </div>
    </header>
  );
}
