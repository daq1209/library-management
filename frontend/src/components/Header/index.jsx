import { useEffect, useState } from "react";
import Brand from "./Brand";
import Hamburger from "./Hamburger";
import Drawer from "./Drawer";
import SearchBox from "./SearchBox";
import Actions from "./Actions";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItems = useSelector((s) => s.cart.cartItems || []);
  const cartCount = cartItems.reduce((s, i) => s + (i.quantity || 1), 0);

  const { currentUser } = useAuth();

  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // search handlers (kept for API compatibility; actual navigation is handled in SearchBox)
  const handleSearchSubmit = () => {};
  const handlePick = () => {};

  // Compose header classes: remove semi-transparent background while drawer open to avoid visual clash
  const headerBase = "sticky top-0 z-40 transition-colors duration-200";
  const elevated = "shadow-[0_6px_20px_rgba(0,0,0,0.06)] border-b border-slate-100";
  const headerClass = `${headerBase} ${drawerOpen ? "bg-white" : scrolled ? `bg-white/95 backdrop-blur ${elevated}` : "bg-white shadow-none"}`;

  return (
    <header className={headerClass} style={{ WebkitBackdropFilter: drawerOpen ? undefined : scrolled ? "blur(6px)" : undefined }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-10">
        <div>
          <nav className="grid grid-cols-3 sm:grid-cols-5 gap-3 h-[64px] lg:h-[70px] items-center">
            {/* Column 1: hamburger + brand (brand shown only on mobile here) */}
            <div className="flex items-center gap-3 col-start-1 col-end-2">
              <Hamburger isOpen={drawerOpen} onToggle={() => setDrawerOpen((s) => !s)} />
              <div className="block sm:hidden">
                <Brand />
              </div>
            </div>

            {/* Column 2 (sm+): Brand centered on tablet/desktop */}
            <div className="hidden sm:flex items-center col-start-2 col-end-3">
              <Brand />
            </div>

            {/* Search: center on mobile (col 2), on sm placed at col 3 */}
            <div className="col-start-2 col-end-3 flex justify-center sm:justify-start sm:col-start-3 sm:col-end-4">
              <SearchBox onSubmit={handleSearchSubmit} onPick={handlePick} />
            </div>

            {/* spacer for layout on tablet/desktop */}
            <div className="hidden sm:block sm:col-start-4 sm:col-end-5" />

            {/* Actions: right aligned (col 3 on mobile, col 5 on sm+) */}
            <div className="col-start-3 col-end-4 flex items-center justify-end gap-3 sm:col-start-5 sm:col-end-6">
              <Actions cartCount={cartCount} />
            </div>
          </nav>
        </div>
      </div>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
