import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import BookCard from './BookCard';
import { getBooks } from '../../utils/booksCatalog';

// Up to 6-8 genres, based on books.json categories
const GENRES = [
  { key: 'All', label: 'Tất cả' },
  { key: 'Business', label: 'Kinh doanh' },
  { key: 'Fiction', label: 'Tiểu thuyết' },
  { key: 'Horror', label: 'Kinh dị' },
  { key: 'Adventure', label: 'Phiêu lưu' },
  { key: 'Marketing', label: 'Marketing' },
  { key: 'Books', label: 'Sách' },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá ↑' },
  { value: 'price_desc', label: 'Giá ↓' },
];

export default function TopSellers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedGenre = searchParams.get('genre') || 'All';
  const selectedSort = searchParams.get('sort') || 'popular';

  // Load data using centralized catalog helper
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const arr = await getBooks();
        if (mounted) setBooks(arr);
      } catch (e) {
        console.error('Failed to load books:', e);
        if (mounted) setError(e.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Client filter + sort
  const filteredAndSorted = useMemo(() => {
    const base = Array.isArray(books) ? books : [];
    let result = base;

    if (selectedGenre !== 'All') {
      result = result.filter((b) => b.category?.toLowerCase() === selectedGenre.toLowerCase());
    }

    switch (selectedSort) {
      case 'newest':
        result = [...result].sort((a, b) => Number(b._id) - Number(a._id));
        break;
      case 'price_asc':
        result = [...result].sort((a, b) => (a.newPrice || 0) - (b.newPrice || 0));
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => (b.newPrice || 0) - (a.newPrice || 0));
        break;
      case 'popular':
      default:
        result = [...result].sort((a, b) => {
          const at = a.bestseller || a.trending ? 1 : 0;
          const bt = b.bestseller || b.trending ? 1 : 0;
          if (bt !== at) return bt - at; // trending/bestseller first
          return Number(b._id) - Number(a._id);
        });
        break;
    }

    return result;
  }, [books, selectedGenre, selectedSort]);

  const shouldLoop = filteredAndSorted.length >= 8;

  const setGenre = (genreKey) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (genreKey === 'All') next.delete('genre');
      else next.set('genre', genreKey);
      return next;
    });
  };

  const onSortChange = (e) => {
    const s = e.target.value;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (s === 'popular') next.delete('sort');
      else next.set('sort', s);
      return next;
    });
  };

  const clearFilters = () => setSearchParams({});

  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 py-10">
      {/* Header row 1 */}
      <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">Bán chạy</h2>

      {/* Header row 2: controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Genre Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Thể loại sách">
          {GENRES.map(({ key, label }) => {
            const selected = selectedGenre === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={selected}
                onClick={() => setGenre(key)}
                className={`flex-shrink-0 rounded-full border px-3 py-1 text-sm font-medium transition
                  ${selected ? 'bg-primary text-black border-primary' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-slate-600 flex-shrink-0">Sắp xếp:</label>
          <select
            id="sort"
            value={selectedSort}
            onChange={onSortChange}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border bg-white overflow-hidden">
              <div className="h-64 bg-slate-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-slate-200 rounded" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredAndSorted.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 mb-4">Không có sách phù hợp bộ lọc.</p>
          <button onClick={clearFilters} className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-black transition">Xóa lọc</button>
        </div>
      )}

      {/* Books list */}
      {!loading && filteredAndSorted.length > 0 && (
        <>
          {/* Desktop/Tablet: Carousel */}
          <div className="hidden sm:block">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={2.3}
              loop={shouldLoop}
              speed={420}
              autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{
                640: { slidesPerView: 2.3, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 18 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 5, spaceBetween: 20 },
              }}
              className="!pb-12"
            >
              {filteredAndSorted.map((b, idx) => (
                <SwiperSlide key={b._id}>
                  <BookCard book={b} eager={idx < 8} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Mobile: Grid 2 cols */}
          <div className="sm:hidden grid grid-cols-2 gap-4">
            {filteredAndSorted.map((b, idx) => (
              <BookCard key={b._id} book={b} eager={idx < 4} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
