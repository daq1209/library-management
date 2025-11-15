import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LuSearch, LuX, LuHeart, LuLoader } from "react-icons/lu";
import { setWishlistBooks } from "../../redux/features/wishlist/wishlistSlice";
import { getImgUrl } from "../../utils/getImgUrl";
import { addToWishlistAPI, getWishlistAPI } from "../../utils/wishlistAPI";
import { getBooks } from "../../utils/booksCatalog";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

// Backend-ready placeholder
export async function fetchBooks(query) {
  try {
    const res = await fetch(`/books.json`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.books || [];
    if (!query) return list;
    return list.filter((b) => String(b.title).toLowerCase().includes(String(query).toLowerCase()));
  } catch (e) {
    // fallback to API stub
    try {
      const r = await fetch(`/api/books?query=${encodeURIComponent(query || "")}`);
      const d = await r.json();
      return Array.isArray(d) ? d : d?.books || [];
    } catch {
      return [];
    }
  }
}

const RECENT_KEY = "nl_recent_searches";
const TRENDING = ["Học máy", "Văn học kinh điển", "Phát triển bản thân"];

function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function RecentAndTrends({ onClickTag }) {
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);
  return (
    <div className="p-3 text-sm text-slate-600">
      {recent?.length > 0 && (
        <div className="mb-3">
          <div className="mb-1 text-[13px] font-semibold text-slate-500">Tìm kiếm gần đây</div>
          <div className="flex flex-wrap gap-2">
            {recent.slice(0, 6).map((q) => (
              <button key={q} className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200 transition" onClick={() => onClickTag(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="mb-1 text-[13px] font-semibold text-slate-500">Xu hướng</div>
        <div className="flex flex-wrap gap-2">
          {TRENDING.map((q) => (
            <button key={q} className="rounded-full bg-primary/10 text-slate-800 px-3 py-1 hover:bg-primary/20 transition" onClick={() => onClickTag(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchResultItem({ book, active, onPick, onWish }) {
  return (
    <li
      role="option"
      aria-selected={!!active}
      onClick={onPick}
      className={`cursor-pointer px-3 py-2 flex items-center gap-3 hover:bg-slate-100 transition ${active ? "bg-primary/10" : ""}`}
    >
      <img
        src={getImgUrl(book.coverImage)}
        alt={book.title}
        loading="lazy"
        className="h-16 w-12 rounded-md object-cover shadow-sm transition-transform duration-150 group-hover:scale-105"
      />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-slate-800">{book.title}</div>
        <div className="truncate text-sm text-slate-500">{book.author || "Tác giả không rõ"}</div>
      </div>
      <button
        type="button"
        aria-label="Add to wishlist"
        onClick={(e) => { e.stopPropagation(); onWish?.(); }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:text-primary transition"
      >
        <LuHeart className="h-5 w-5" />
      </button>
    </li>
  );
}

export default function SearchBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const wishlistItems = useSelector((s) => s.wishlist.items);

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(-1);

  const debounced = useDebounced(value, 300);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  // fetch suggestions
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const q = debounced.trim();
      if (!q) { setItems([]); return; }
      setLoading(true);
      const data = await fetchBooks(q);
      if (!cancelled) {
        setItems(data?.slice(0, 10) || []);
        setLoading(false);
        setOpen(true);
        setActive(-1);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [debounced]);

  // outside click & ESC
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const submit = useCallback((q) => {
    const term = (q ?? value).trim();
    if (!term) return;
    // save recent
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const next = [term, ...arr.filter((x) => x !== term)].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setOpen(false);
  }, [navigate, value]);

  const pick = useCallback((b) => {
    navigate(`/book/${b._id}`, { state: { book: b } });
    setOpen(false);
    setValue("");
  }, [navigate]);

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (active >= 0 && items[active]) pick(items[active]);
      else submit();
    }
  };

  return (
    <div className="relative w-full" ref={wrapRef}>
      {/* Input */}
      <div
        className={`group relative mx-auto w-full transition-[max-width] duration-200 md:max-w-xl md:focus-within:max-w-2xl`}
      >
        {/* floating placeholder */}
          <span className={`pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-slate-500 transition-transform duration-200 ${value ? "-translate-y-4 text-xs" : ""}`}>
          Tìm kiếm sách, tác giả, thể loại...
        </span>
        <form
          onSubmit={(e) => { e.preventDefault(); submit(); }}
          className="flex items-center gap-2 rounded-2xl bg-white/60 px-4 py-2.5 shadow-sm ring-1 ring-black/5 backdrop-blur-md focus-within:ring-2 focus-within:ring-primary/50"
          role="search"
        >
          <LuSearch className="h-5 w-5 text-slate-600" aria-hidden="true" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="peer w-full bg-transparent outline-none text-slate-800 placeholder:text-transparent"
            placeholder="Tìm kiếm sách, tác giả, thể loại..."
            aria-label="Tìm kiếm"
          />
          {!!value && (
            <button
              type="button"
              onClick={() => setValue("")}
              aria-label="Xóa tìm kiếm"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:text-primary"
            >
              <LuX className="h-5 w-5" />
            </button>
          )}
        </form>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur-md animate-[fadeSlideDown_.18s_ease-out_both]">
          {loading ? (
            <div className="flex items-center gap-2 p-3 text-sm text-slate-600">
              <LuLoader className="h-4 w-4 animate-spin" />
              Đang tìm kiếm...
            </div>
          ) : value.trim() ? (
            items.length === 0 ? (
              <div className="p-3 text-sm text-slate-600">Không tìm thấy kết quả cho “{value}”. Thử từ khóa khác hoặc xem gợi ý bên dưới.</div>
            ) : (
              <ul ref={listRef} role="listbox" className="max-h-[420px] overflow-auto scrollbar-hidden divide-y divide-slate-100">
                {items.map((b, i) => (
                  <SearchResultItem
                    key={b._id || b.id || `${b.title}-${i}`}
                    book={b}
                    active={i === active}
                    onPick={() => pick(b)}
                    onWish={async () => {
                      if (!currentUser) {
                        showToast('Vui lòng đăng nhập để sử dụng Wishlist', 'warning');
                        navigate('/login');
                        return;
                      }
                      const exists = wishlistItems?.some((it) => String(it._id) === String(b._id ?? b.id));
                      if (exists) {
                        showToast('Sách đã được thêm vào wishlist', 'warning');
                        return;
                      }
                      try {
                        await addToWishlistAPI(b._id ?? b.id);
                        const [resp, books] = await Promise.all([getWishlistAPI(), getBooks()]);
                        const ids = resp.data.items || [];
                        const mapped = ids.map(id => books.find(x => String(x._id) === String(id))).filter(Boolean);
                        dispatch(setWishlistBooks(mapped));
                        showToast('✨ Đã thêm vào Wishlist', 'success');
                      } catch (e) {
                        showToast('Không thể thêm vào Wishlist', 'error');
                      }
                    }}
                  />
                ))}
              </ul>
            )
          ) : (
            <RecentAndTrends onClickTag={(q) => { setValue(q); setOpen(false); navigate(`/search?q=${encodeURIComponent(q)}`); }} />
          )}
        </div>
      )}
    </div>
  );
}
