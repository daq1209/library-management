import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi";
import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleBorrowClick = () => {
    // dẫn sang trang mượn riêng, truyền kèm thông tin sách
    navigate("/borrow", { state: { book } });
  };

  return (
    <div className="h-full w-[200px] sm:w-[210px] md:w-[220px] rounded-lg border border-gray-200 bg-white p-1.5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
      {/* Cover */}
      <Link to={`/books/${book?._id}`} className="rounded-md overflow-hidden border">
        <img
          src={getImgUrl(book?.coverImage)}
          alt={book?.title || "Book cover"}
          className="w-full h-44 object-cover transition-transform duration-200 hover:scale-105"
        />
      </Link>

      {/* Title */}
      <Link to={`/books/${book?._id}`}>
        <h3 className="text-[14px] font-semibold mt-2 mb-1 line-clamp-2 min-h-10 hover:text-blue-600">
          {book?.title}
        </h3>
      </Link>

      {/* Description */}
      <p className="text-gray-600 text-[13px] leading-relaxed mb-2 line-clamp-3 min-h-[3.6rem]">
        {book?.description}
      </p>

      {/* Footer */}
      <div className="mt-auto min-h-[4.2rem] flex flex-col justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-semibold text-gray-900">${book?.newPrice}</span>
          <span className="line-through text-gray-400 text-[12px]">${book?.oldPrice}</span>
        </div>

        <div className="flex gap-2 mt-2">
          {/* Nút Mua (thêm vào giỏ) */}
          <button
            onClick={() => handleAddToCart(book)}
            className="flex-1 h-9 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md flex items-center justify-center gap-1 font-medium text-[13px] transition-colors"
          >
            <FiShoppingCart className="text-[14px]" />
            <span>Mua</span>
          </button>

          {/* Nút Mượn (sang trang Borrow) */}
          <button
            onClick={handleBorrowClick}
            className="flex-1 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center gap-1 font-medium text-[13px] transition-colors"
          >
            <HiOutlineBookOpen className="text-[14px]" />
            <span>Mượn</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
