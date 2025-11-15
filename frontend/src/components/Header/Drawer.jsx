import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineShoppingCart,
  HiOutlineInformationCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineBookOpen,
} from "react-icons/hi2";

export default function Drawer({ isOpen, onClose }) {
  const panelRef = useRef(null);
  const loc = useLocation();
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  // lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
  }, [isOpen]);

  // close on route change
  useEffect(() => {
    if (isOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // focus trap (simple)
  useEffect(() => {
    if (!isOpen) return;
    const el = panelRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // touch handlers for swipe-to-close
    const onTouchStart = (ev) => {
      touchStartX.current = ev.touches?.[0]?.clientX || 0;
      touchCurrentX.current = touchStartX.current;
    };
    const onTouchMove = (ev) => {
      touchCurrentX.current = ev.touches?.[0]?.clientX || touchCurrentX.current;
    };
    const onTouchEnd = () => {
      const diff = touchCurrentX.current - touchStartX.current;
      // if swiped left by 50px or more -> close
      if (diff < -50) onClose();
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("keydown", onKey);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          aria-label="Main menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* overlay */}
          <motion.div
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* panel */}
          <motion.aside
            ref={panelRef}
            className="absolute left-0 top-0 bottom-0 w-[86%] sm:w-[360px] bg-white shadow-xl p-4"
            initial={{ x: -380 }}
            animate={{ x: 0 }}
            exit={{ x: -380 }}
            transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.8 }}
          >
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100" />
            <div>
              <div className="text-lg font-semibold">NovaLibrary</div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <MenuItem to="/" label="Home" icon={<HiOutlineHome />} onClick={onClose} />
          <MenuItem to="/about" label="About" icon={<HiOutlineInformationCircle />} onClick={onClose} />
          <MenuItem to="/orders" label="Orders" icon={<HiOutlineClipboardDocumentList />} onClick={onClose} />
          <MenuItem to="/cart" label="Cart" icon={<HiOutlineShoppingCart />} onClick={onClose} />
          <MenuItem to="/borrow" label="Borrow" icon={<HiOutlineBookOpen />} onClick={onClose} />
        </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuItem({ to, label, icon, onClick }) {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-50 ${active ? "bg-slate-50 text-primary font-medium" : "text-slate-700"}`}
    >
      {active && <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r" />}
      <span className={`w-6 h-6 ${active ? "text-primary" : "text-slate-600"}`}>{icon}</span>
      <span className="flex-1">{label}</span>
    </Link>
  );
}
