import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiMiniBars3CenterLeft,
  HiOutlineHeart,
  HiOutlineShoppingCart,
} from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser, HiXMark } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { getImgUrl } from "../utils/getImgUrl";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [openSuggest, setOpenSuggest] = useState(false);
  const inputRef = useRef(null);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);

  // tải dữ liệu sách
  useEffect(() => {
    fetch("/books.json")
      .then((r) => r.json())
      .then((data) => setBooks(Array.isArray(data) ? data : data?.books || []))
      .catch(() => setBooks([]));
  }, []);

  const normalize = (s = "") =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // lọc danh sách gợi ý
  const results = useMemo(() => {
    const q = normalize(search.trim());
    if (!q) return [];
    return books.filter((b) => normalize(b.title).includes(q)).slice(0, 8);
  }, [books, search]);

  // đóng box khi click ra ngoài
  useEffect(() => {
    const onClick = (e) => {
      if (
        openSuggest &&
        boxRef.current &&
        !boxRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setOpenSuggest(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenSuggest(false);
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [openSuggest]);

  const goDetail = (book) => {
    setOpenSuggest(false);
    setSearch("");
    navigate(`/book/${book._id}`, { state: { book } });
  };

  // ➕ Enter hoặc nhấn nút tìm → dẫn tới trang tìm kiếm
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setOpenSuggest(false);
  };

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
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden md:block w-[280px] lg:w-[360px]"
          >
            <div
              ref={inputRef}
              className="flex items-center bg-[#EAEAEA] rounded-md px-3 py-2"
            >
              <IoSearchOutline className="text-slate-600 text-lg mr-2" />
              <input
                type="text"
                placeholder="Tìm sách..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setOpenSuggest(true);
                }}
                onFocus={() => results.length && setOpenSuggest(true)}
                className="bg-transparent w-full text-sm focus:outline-none font-sans text-slate-700"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setOpenSuggest(false);
                  }}
                  className="ml-1 text-slate-500 hover:text-slate-700"
                  type="button"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="ml-2 text-slate-600 hover:text-primary"
                aria-label="Tìm kiếm"
              >
                <IoSearchOutline className="w-5 h-5" />
              </button>
            </div>

            {/* Gợi ý */}
            {openSuggest && results.length > 0 && (
              <div
                ref={boxRef}
                className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-md shadow-lg max-h-[420px] overflow-auto z-50"
              >
                <ul className="divide-y divide-slate-100">
                  {results.map((b) => (
                    <li
                      key={b._id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => goDetail(b)}
                    >
                      <div className="flex items-center gap-3 px-3 py-2">
                        <img
                          src={getImgUrl(b.coverImage)}
                          alt={b.title}
                          className="w-10 h-12 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-slate-800 line-clamp-1">
                            {b.title}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {b.author || "Tác giả không rõ"}
                          </p>
                        </div>
                        {b.newPrice && (
                          <span className="text-xs font-semibold text-primary">
                            {b.newPrice.toLocaleString()}đ
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(search.trim())}`)}
                  className="w-full text-center text-sm py-2 text-slate-600 hover:bg-slate-50 border-t border-slate-100"
                >
                  Xem tất cả kết quả
                </button>
              </div>
            )}
          </form>

          {/* Right: User, Wishlist, Cart */}
          <div className="flex items-center gap-3">
            <Link
              to="/wishlist"
              className="hidden sm:inline-flex text-slate-700 hover:text-primary"
              aria-label="Wishlist"
            >
              <HiOutlineHeart className="w-6 h-6" />
            </Link>

            <Link
              to="/cart"
              className="relative bg-primary text-black rounded-sm px-3 py-1 flex items-center gap-1 hover:bg-primary-600 transition-colors"
              aria-label="Giỏ hàng"
            >
              <HiOutlineShoppingCart className="w-5 h-5" />
              {cartItems?.length > 0 && (
                <span className="text-sm font-semibold">
                  {cartItems.reduce((s, i) => s + (i.quantity || 1), 0)}
                </span>
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

        {/* Menu nhỏ */}
        {menuOpen && (
          <div
            id="main-menu"
            className="absolute left-6 right-6 top-full mt-2 bg-white shadow-md rounded-md p-4 space-y-3"
          >
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-700 font-medium hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-700 font-medium hover:text-primary"
            >
              About
            </Link>
            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-700 font-medium hover:text-primary"
            >
              Orders
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-700 font-medium hover:text-primary"
            >
              Cart
            </Link>
            <Link
              to="/borrow"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-700 font-medium hover:text-primary"
            >
              Borrowing books
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
