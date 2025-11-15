import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LuSparkles, LuMenu, LuX } from "react-icons/lu";
import SearchBar from "./Header/SearchBar";
import Actions from "./Header/Actions";

// Reusable icon button with optional badge
function IconButton({ ariaLabel, onClick, children, count }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/70 transition elevate"
    >
      {children}
      {Number(count) > 0 && (
        <span
          className="badge-pop absolute -right-1 -top-1 min-w-[18px] rounded-full bg-primary px-1.5 text-center text-[11px] font-semibold text-black shadow-sm"
          aria-label={`${count} mục`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 group" aria-label="Về trang chủ">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/70 text-primary ring-1 ring-black/5 group-hover:shadow-sm transition">
        <LuSparkles className="h-5 w-5" />
      </span>
      <span className="font-display text-lg md:text-xl text-slate-900">NovaLibrary</span>
    </Link>
  );
}

// NOTE: DesktopSearch & MobileSearchOverlay replaced by unified <SearchBar /> component.

function MobileDrawer({ open, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!panelRef.current) return;
      if (open && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[55] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div className={`absolute inset-0 bg-black/40 ${open ? "animate-[fadeIn_.15s_both]" : "animate-[fadeOut_.15s_both]"}`} />
      <aside
        ref={panelRef}
        className={`absolute left-0 top-0 h-full w-[82%] max-w-[360px] bg-white shadow-xl ring-1 ring-black/5 ${open ? "animate-[slideInLeft_.22s_cubic-bezier(.22,.8,.24,1)_both]" : "animate-[slideOutLeft_.18s_ease_both]"}`}
      >
        <div className="flex items-center justify-between p-4">
          <Brand />
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-3 pb-6">
          <ul className="space-y-1 text-slate-700">
            {[
              ["Trang chủ", "/"],
              ["Bán chạy", "/?section=top-sellers"],
              ["Gợi ý", "/?section=recommended"],
              ["Tin tức", "/?section=news"],
              ["Giới thiệu", "/about"],
            ].map(([label, to]) => (
              <li key={label}>
                <Link
                  to={to}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-2 text-base hover:bg-slate-50"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cartCount = useSelector((s) => s?.cart?.cartItems?.length || 0);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition backdrop-blur-md ${
        isScrolled ? "bg-white/80 header-shadow" : "bg-white/60"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-screen-2xl items-center gap-3 px-6 md:px-10 lg:px-12">
        {/* Left */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Mở menu"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary md:hidden"
          >
            <LuMenu className="h-5 w-5" />
          </button>
          <Brand />
        </div>

        {/* Middle: unified searchable component */}
        <div className="flex-1 px-2">
          <SearchBar />
        </div>

        {/* Right: Actions (Wishlist, Cart, User menu) */}
        <div className="ml-auto flex items-center gap-1">
          <Actions cartCount={cartCount} />
        </div>
      </div>

      {/* Primary nav for >= md */}
      <div className="hidden md:block border-t border-black/5">
        <nav className="mx-auto max-w-screen-2xl px-6 md:px-10 lg:px-12">
          <ul className="flex items-center gap-6 py-2 text-sm text-slate-700">
            <li><Link className="flink hover:text-primary" to="/">Trang chủ</Link></li>
            <li><Link className="flink hover:text-primary" to="/?section=top-sellers">Bán chạy</Link></li>
            <li><Link className="flink hover:text-primary" to="/?section=recommended">Gợi ý</Link></li>
            <li><Link className="flink hover:text-primary" to="/?section=news">Tin tức</Link></li>
            <li><Link className="flink hover:text-primary" to="/about">Giới thiệu</Link></li>
          </ul>
        </nav>
      </div>

      {/* Drawer only (search handled inline now) */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
