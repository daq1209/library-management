import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./News.css";
import NewsCard from "./NewsCard";

import news1 from "../../assets/news/news1.png";
import news2 from "../../assets/news/news2.png";
import news3 from "../../assets/news/news3.png";
import news4 from "../../assets/news/news4.png";

const newsData = [
  {
    id: "1",
    title: "Global Climate Summit Calls for Urgent Action",
    summary: "World leaders gather at the Global Climate Summit to discuss urgent strategies to combat climate change, focusing on reducing carbon emissions and fostering renewable energy solutions.",
    thumb: news1,
    source: "Library Blog",
    publishedAt: "2h ago",
    tag: "Events",
    url: "#"
  },
  {
    id: "2",
    title: "Breakthrough in AI Technology Announced",
    summary: "A major breakthrough in artificial intelligence has been announced by researchers, with new advancements promising to revolutionize industries from healthcare to finance.",
    thumb: news2,
    source: "Tech News",
    publishedAt: "5h ago",
    tag: "Tech",
    url: "#"
  },
  {
    id: "3",
    title: "New Space Mission Aims to Explore Distant Galaxies",
    summary: "NASA has unveiled plans for a new space mission that will aim to explore distant galaxies, with hopes of uncovering insights into the origins of the universe.",
    thumb: news3,
    source: "NYT",
    publishedAt: "1d ago",
    tag: "Other",
    url: "#"
  },
  {
    id: "4",
    title: "Stock Markets Reach Record Highs Amid Economic Recovery",
    summary: "Global stock markets have reached record highs as signs of economic recovery continue to emerge following the challenges posed by the global pandemic.",
    thumb: news4,
    source: "Finance Today",
    publishedAt: "2d ago",
    tag: "Other",
    url: "#"
  },
  {
    id: "5",
    title: "Innovative New Smartphone Released by Leading Tech Company",
    summary: "A leading tech company has released its latest smartphone model, featuring cutting-edge technology, improved battery life, and a sleek new design.",
    thumb: news2,
    source: "Tech Review",
    publishedAt: "3d ago",
    tag: "Tech",
    url: "#"
  },
  {
    id: "6",
    title: "Library Expands Digital Collection with 1000+ New eBooks",
    summary: "Our library is proud to announce the expansion of our digital collection with over 1000 new eBooks covering various genres and topics.",
    thumb: news1,
    source: "Library News",
    publishedAt: "4d ago",
    tag: "Library",
    url: "#"
  }
];

const TAGS = ["All", "Library", "Book", "Tech", "Events"]; // hiển thị nhãn sẽ dịch bên dưới

export default function News() {
  const [selectedTag, setSelectedTag] = useState("All");
  const [loading] = useState(false);

  const filteredNews = selectedTag === "All" 
    ? newsData 
    : newsData.filter((item) => item.tag === selectedTag);

  const shouldLoop = filteredNews.length >= 6;

  return (
    <section className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 py-12">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
          Tin tức
        </h2>

        {/* Tag Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Chuyên mục tin tức">
          {TAGS.map((tag) => {
            const selected = selectedTag === tag;
            return (
              <button
                key={tag}
                role="tab"
                aria-selected={selected}
                onClick={() => setSelectedTag(tag)}
                className={`flex-shrink-0 rounded-full border px-3 py-1 text-sm font-medium transition
                  ${selected ? 'bg-primary text-black border-primary' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
              >
                {tag === 'All' ? 'Tất cả' : tag === 'Library' ? 'Thư viện' : tag === 'Book' ? 'Sách' : tag === 'Tech' ? 'Công nghệ' : tag === 'Events' ? 'Sự kiện' : tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white border rounded-xl p-5">
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <div className="space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-4 bg-slate-200 rounded" />
                </div>
                <div className="w-24 h-24 bg-slate-200 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredNews.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-600 mb-4">
            Chưa có tin mới. Quay lại sau nhé!
          </p>
          <Link
            to="/?section=top-sellers"
            className="inline-block px-6 py-2.5 bg-primary text-black rounded-md font-medium hover:opacity-90 transition"
          >
            Xem Bán chạy
          </Link>
        </div>
      )}

      {/* News carousel */}
      {!loading && filteredNews.length > 0 && (
        <div className="relative">
          <Swiper
            className="news-swiper"
            modules={[Navigation, Pagination]}
            slidesPerView={1.05}
            spaceBetween={16}
            speed={420}
            loop={shouldLoop}
            loopAdditionalSlides={3}
            centeredSlides={false}
            slidesPerGroupSkip={1}
            watchSlidesProgress
            navigation={{
              prevEl: ".news-nav-prev",
              nextEl: ".news-nav-next",
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 18, slidesPerGroup: 2 },
              1024: { slidesPerView: 2.4, spaceBetween: 20, slidesPerGroup: 2 },
              1280: { slidesPerView: 3, spaceBetween: 20, slidesPerGroup: 3 },
            }}
          >
            {filteredNews.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="h-full">
                  <NewsCard item={item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons */}
          <button
            className="news-nav-prev nav-btn hidden sm:flex items-center justify-center absolute left-0 z-10 w-11 h-11 rounded-full bg-white shadow-md hover:scale-105 active:scale-98 transition-transform disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
            aria-label="Tin trước"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="news-nav-next nav-btn hidden sm:flex items-center justify-center absolute right-0 z-10 w-11 h-11 rounded-full bg-white shadow-md hover:scale-105 active:scale-98 transition-transform disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
            aria-label="Tin sau"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}