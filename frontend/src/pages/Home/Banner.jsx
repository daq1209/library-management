
import React from "react";


import bannerImg from "../../assets/banner.png";


const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12">
      {/* Ảnh bên phải (trên mobile nằm trên) */}
      <div className="md:w-1/2 w-full flex items-center md:justify-end">
        <img
          src={bannerImg}
          alt="New books this week"
          className="max-w-full h-auto rounded-md shadow-md"
          loading="eager"
        />
      </div>

      {/* Nội dung bên trái */}
      <div className="md:w-1/2 w-full">
        <h1 className="md:text-5xl text-3xl font-medium mb-7 font-display">
          New Books This Week
        </h1>

        <p className="mb-10 text-slate-600">
          It's time to update your reading list with some of the latest and
          greatest releases in the literary world. From heart-pumping thrillers
          to captivating memoirs, this week's new releases offer something for
          everyone.
        </p>

        <button className="btn-primary">Đọc ngay</button>
    
      </div>
    </div>
  );
};

export default Banner;
