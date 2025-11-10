import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import BookCard from "../books/BookCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Fisher–Yates shuffle
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const Recommended = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/books.json")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.books || [];
        setBooks(shuffleArray(list).slice(0, 12)); // 8–12 tùy bạn
      });
  }, []);

  const showLoop = books.length >= 8;

  return (
    <div className="py-12">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
        Recommended for you
      </h2>

      <Swiper
        // Base (mobile)
        slidesPerView={1.2}
        slidesPerGroup={1}
        spaceBetween={12}
        slidesOffsetBefore={10}
        slidesOffsetAfter={10}

        // Giúp vị trí pixel tròn -> không xê dịch lẻ
        roundLengths
        speed={420}

        // Loop mượt, luôn đủ group ở trang cuối
        loop={showLoop}
        loopFillGroupWithBlank
        loopAdditionalSlides={4}

        navigation={{ nextEl: ".nav-next", prevEl: ".nav-prev" }}
        pagination={{ clickable: true }}

        // Ở desktop: KHÔNG offset, group = view -> cụm đứng thẳng hàng
        breakpoints={{
          640:  { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 14, slidesOffsetBefore: 6,  slidesOffsetAfter: 6  },
          768:  { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 16, slidesOffsetBefore: 8,  slidesOffsetAfter: 8  },
          1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 18, slidesOffsetBefore: 0,  slidesOffsetAfter: 0  },
          1280: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20, slidesOffsetBefore: 0,  slidesOffsetAfter: 0  },
          1440: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 22, slidesOffsetBefore: 0,  slidesOffsetAfter: 0  },
        }}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        {books.map((book, idx) => (
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
  );
};

export default Recommended;
