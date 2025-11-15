import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";

export default function Banner() {
  const [isPointerCoarse, setIsPointerCoarse] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    // detect pointer type for disabling parallax on mobile
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setIsPointerCoarse(coarse);
  }, []);

  const handleMouseMove = (e) => {
    if (isPointerCoarse) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 50;
    const y = (e.clientY - rect.top - rect.height / 2) / 50;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Sample book covers (replace with your own or fetch from books.json)
  const stackBooks = [
    { id: 1, cover: "book-1.png" },
    { id: 2, cover: "book-2.png" },
    { id: 3, cover: "book-3.png" },
    { id: 4, cover: "book-4.png" },
  ];

  return (
    <section className="relative bg-slate-50 overflow-hidden">
      {/* Subtle radial gradient behind stack */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-40" />
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 pt-10 md:pt-14 min-h-[58vh] md:min-h-[64vh] flex items-center">
        <div className="grid grid-cols-12 gap-8 items-center w-full">
          {/* Left: Title + CTA */}
          <motion.div
            className="col-span-12 md:col-span-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
            }}
          >
            {/* Floating badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm mb-6"
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.12 }}
            >
              ✨ Tuần này có 24 tựa mới
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-slate-900 mb-6"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              Khám phá thế giới tri thức
            </motion.h1>

            <motion.p
              className="text-slate-600 text-lg leading-relaxed max-w-xl mb-8"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              Từ sách hay bán chạy đến tác phẩm kinh điển, hàng nghìn đầu sách đang chờ bạn
              khám phá. Cập nhật hàng tuần, dễ dàng mượn và đọc ngay.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <Link
                to="/search"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-black font-medium rounded-md hover:bg-secondary hover:text-white transition-colors duration-200"
                aria-label="Khám phá sách"
              >
                Khám phá ngay
              </Link>

              <a
                href="#new-books"
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-100 transition-colors duration-200"
                aria-label="Xem sách mới"
              >
                Xem sách mới
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Book stack with parallax */}
          <motion.div
            className="col-span-12 md:col-span-6 relative h-[320px] md:h-[480px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {stackBooks.slice(0, isPointerCoarse ? 2 : 4).map((book, i) => (
                <motion.div
                  key={book.id}
                  className="absolute"
                  style={{
                    x: !isPointerCoarse ? springX : 0,
                    y: !isPointerCoarse ? springY : 0,
                    zIndex: i,
                  }}
                  initial={{ opacity: 0, y: 40, rotate: -8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: (i - 1.5) * 2,
                    x: (i - 1.5) * 20,
                  }}
                  transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200, damping: 25 }}
                >
                  <img
                    src={getImgUrl(book.cover)}
                    alt={`Book ${i + 1}`}
                    className="w-[160px] md:w-[200px] lg:w-[240px] h-auto object-cover rounded-2xl shadow-2xl"
                    loading={i < 2 ? "eager" : "lazy"}
                    width="240"
                    height="360"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
