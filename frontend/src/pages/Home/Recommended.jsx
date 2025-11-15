import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import RecommendedCard from "./RecommendedCard";
import { getBooks } from "../../utils/booksCatalog";

// Mock FE scoring: prefer categories/authors from localStorage
const scoreBooks = (books) => {
  const recentViews = JSON.parse(localStorage.getItem("recentViews") || "[]");
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  
  const viewedCategories = recentViews.map((b) => b.category?.toLowerCase()).filter(Boolean);
  const wishlistCategories = wishlist.map((b) => b.category?.toLowerCase()).filter(Boolean);
  const allCategories = [...viewedCategories, ...wishlistCategories];
  
  return books.map((book) => {
    const catMatch = allCategories.includes(book.category?.toLowerCase()) ? 0.6 : 0;
    const jitter = Math.random() * 0.1;
    return { ...book, score: catMatch + jitter };
  }).sort((a, b) => b.score - a.score);
};

export default function Recommended() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const arr = await getBooks();
        const scored = scoreBooks(arr).slice(0, 12);
        if (mounted) setBooks(scored);
      } catch (e) {
        console.error("Failed to load books:", e);
        if (mounted) setBooks([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const shouldLoop = books.length >= 8;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 py-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-2">
          Gợi ý dành cho bạn
        </h2>
        <p className="text-slate-500 text-sm">
          Dựa trên sách đã xem & wishlist của bạn
        </p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border bg-white overflow-hidden">
              <div className="h-64 bg-slate-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-slate-200 rounded" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && books.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-600 mb-4">
            Chúng tôi chưa đủ dữ liệu để đề xuất. Hãy thêm vài cuốn vào wishlist!
          </p>
          <button
            onClick={() => navigate("/?section=top-sellers")}
            className="px-6 py-2.5 bg-primary text-black rounded-md font-medium hover:opacity-90 transition"
          >
            Khám phá Top Sellers
          </button>
        </div>
      )}

      {/* Books list */}
      {!loading && books.length > 0 && (
        <>
          {/* Mobile: Grid 2 cols (no Swiper for performance) */}
          {isMobile && (
            <div className="grid grid-cols-2 gap-4">
              {books.map((book, idx) => (
                <RecommendedCard key={book._id} book={book} index={idx} eager={idx < 4} />
              ))}
            </div>
          )}

          {/* Desktop/Tablet: Swiper carousel */}
          {!isMobile && (
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={2.2}
                spaceBetween={14}
                speed={420}
                roundLengths={true}
                loop={shouldLoop}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                slidesOffsetBefore={6}
                slidesOffsetAfter={6}
                navigation={{
                  prevEl: ".rec-nav-prev",
                  nextEl: ".rec-nav-next",
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                breakpoints={{
                  640: { slidesPerView: 2.2, spaceBetween: 14, slidesOffsetBefore: 6, slidesOffsetAfter: 6 },
                  768: { slidesPerView: 3, spaceBetween: 16, slidesOffsetBefore: 8, slidesOffsetAfter: 8 },
                  1024: { slidesPerView: 4, spaceBetween: 18, slidesOffsetBefore: 0, slidesOffsetAfter: 0 },
                  1280: { slidesPerView: 5, spaceBetween: 20, slidesOffsetBefore: 0, slidesOffsetAfter: 0 },
                }}
                className="!pb-12"
              >
                {books.map((book, idx) => (
                  <SwiperSlide key={book._id}>
                    <RecommendedCard book={book} index={idx} eager={idx < 8} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation buttons (desktop only) */}
              <button
                className="rec-nav-prev hidden sm:flex items-center justify-center absolute left-0 top-1/3 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-md hover:scale-105 active:scale-98 transition-transform disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
                aria-label="Previous recommended books"
              >
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="rec-nav-next hidden sm:flex items-center justify-center absolute right-0 top-1/3 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-md hover:scale-105 active:scale-98 transition-transform disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
                aria-label="Next recommended books"
              >
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
