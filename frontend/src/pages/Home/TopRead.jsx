import React, { useEffect, useState } from "react";
import BookCard from "../books/BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./TopRead.css";

const categories = ["Choose a genre", "Business", "Fiction", "Horror", "Adventure"];

export default function TopRead() {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");

  useEffect(() => {
    fetch("/books.json")
      .then((res) => res.json())
      .then((data) => setBooks(Array.isArray(data) ? data : data?.books || []));
  }, []);

  const filteredBooks =
    selectedCategory === "Choose a genre"
      ? books
      : books.filter(
          (b) =>
            (b?.category ?? "").toLowerCase().trim() ===
            selectedCategory.toLowerCase().trim()
        );

  const showLoop = filteredBooks.length > 3;

  return (
    <section className="py-12">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 relative">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
          Top Sellers
        </h2>

        {/* Category */}
        <div className="mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Swiper
          slidesPerView={1.2}
          spaceBetween={12} // giảm khoảng cách nhỏ hơn
          centeredSlides={false}
          centeredSlidesBounds={false}
          slidesOffsetBefore={10}
          slidesOffsetAfter={10}
          navigation={{ nextEl: ".nav-next", prevEl: ".nav-prev" }}
          pagination={{ clickable: true }}
          loop={showLoop}
          breakpoints={{
            640:  { slidesPerView: 2.1, spaceBetween: 14 },
            768:  { slidesPerView: 2.6, spaceBetween: 16 },
            1024: { slidesPerView: 3,   spaceBetween: 18 },
            1280: { slidesPerView: 3.2, spaceBetween: 20 },
            1440: { slidesPerView: 3.3, spaceBetween: 22 },
          }}
          modules={[Navigation, Pagination]}
          className="mySwiper"
        >
          {filteredBooks.map((book, idx) => (
            <SwiperSlide key={book?._id || idx}>
              <div className="slide-animate">
                <BookCard book={book} />
              </div>
            </SwiperSlide>
          ))}

          <button className="nav-prev nav-btn" aria-label="Previous">
            &lt;
          </button>
          <button className="nav-next nav-btn" aria-label="Next">
            &gt;
          </button>
        </Swiper>
      </div>
    </section>
  );
}
