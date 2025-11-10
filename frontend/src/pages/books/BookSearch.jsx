// src/pages/books/BookSearch.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BookCard from "./BookCard.jsx";

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // bỏ dấu tiếng Việt
}

export default function BookSearch() {
  const [books, setBooks] = useState([]);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  // Query từ URL
  const qParam = (params.get("q") || "").trim();
  const genreParam = (params.get("genre") || "").trim();

  // Ô nhập tìm kiếm & select thể loại (để user chỉnh trên trang)
  const [keyword, setKeyword] = useState(qParam);
  const [genre, setGenre] = useState(genreParam);

  // Tải dữ liệu sách
  useEffect(() => {
    fetch("/books.json")
      .then((r) => r.json())
      .then((data) => setBooks(Array.isArray(data) ? data : data?.books || []))
      .catch(() => setBooks([]));
  }, []);

  // Đồng bộ khi người dùng đổi URL (back/forward)
  useEffect(() => setKeyword(qParam), [qParam]);
  useEffect(() => setGenre(genreParam), [genreParam]);

  // Tập thể loại (category/genre) rút ra từ dữ liệu
  const genres = useMemo(() => {
    const set = new Set();
    books.forEach((b) => {
      const g = (b.category || b.genre || "").trim();
      if (g) set.add(g);
    });
    return ["Tất cả", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [books]);

  // Lọc kết quả theo q + genre
  const results = useMemo(() => {
    const q = normalize(qParam);
    const g = genreParam;

    return books.filter((b) => {
      const matchText =
        !q ||
        [b.title, b.author, b.category, b.genre]
          .filter(Boolean)
          .some((f) => normalize(f).includes(q));

      const gVal = (b.category || b.genre || "").trim();
      const matchGenre = !g || g === "Tất cả" || gVal === g;

      return matchText && matchGenre;
    });
  }, [books, qParam, genreParam]);

  // Submit form -> cập nhật query (?q=, ?genre=)
  const onSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (keyword.trim()) next.q = keyword.trim();
    if (genre && genre !== "Tất cả") next.genre = genre;
    setParams(next);
  };

  const clearFilters = () => {
    setKeyword("");
    setGenre("Tất cả");
    navigate("/search");
  };

  return (
    <section className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-display font-bold text-slate-800 mb-4">
        Tìm kiếm sách
      </h1>

      {/* Thanh tìm + filter */}
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Nhập từ khóa (tên, tác giả, thể loại)"
          className="md:col-span-6 bg-white border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
        />
        <select
          value={genre || "Tất cả"}
          onChange={(e) => setGenre(e.target.value)}
          className="md:col-span-3 bg-white border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary"
        >
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <div className="md:col-span-3 flex gap-2">
          <button
            type="submit"
            className="bg-primary text-black px-4 py-2 rounded-md hover:opacity-90 transition w-full md:w-auto"
          >
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition w-full md:w-auto"
          >
            Xóa lọc
          </button>
        </div>
      </form>

      {/* Trạng thái & Kết quả */}
      {!qParam && !genreParam ? (
        <p className="text-slate-600">Nhập từ khóa hoặc chọn thể loại để bắt đầu tìm.</p>
      ) : results.length === 0 ? (
        <p className="text-slate-600">
          Không tìm thấy kết quả cho{" "}
          {qParam && <span className="font-semibold">“{qParam}”</span>}
          {genreParam && (
            <>
              {" "}
              với thể loại <span className="font-semibold">“{genreParam}”</span>
            </>
          )}
          .
        </p>
      ) : (
        <>
          <p className="text-slate-600 mb-4">
            Có <span className="font-semibold">{results.length}</span> kết quả
            {qParam && (
              <>
                {" "}cho <span className="font-semibold">“{qParam}”</span>
              </>
            )}
            {genreParam && (
              <>
                {" "}— Thể loại: <span className="font-semibold">“{genreParam}”</span>
              </>
            )}
            .
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
