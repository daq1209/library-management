import React, { useCallback, useState } from "react";
import { LuSparkles, LuFacebook, LuTwitter, LuInstagram, LuMail } from "react-icons/lu";

// NovaLibrary Footer – dark, minimal, elegant
const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Placeholder for future backend integration
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      // TODO: call newsletter API endpoint here
      await new Promise((r) => setTimeout(r, 700));
      // You can add a toast here in the future
    } finally {
      setSubmitting(false);
    }
  }, [email]);

  return (
    <footer className="relative bg-[#0B1220] text-slate-300">
      {/* Subtle horizon line */}
      <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-screen-2xl mx-auto py-12 px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {/* Brand and quick links */}
          <div>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                <LuSparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-xl text-white">NovaLibrary</p>
                <p className="text-sm text-slate-400">Đọc. Khám phá. Phát triển.</p>
              </div>
            </div>

            <nav aria-label="Footer quick links" className="mt-6">
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <li><a className="flink hover:text-white" href="/">Trang chủ</a></li>
                <li><a className="flink hover:text-white" href="/books">Sách</a></li>
                <li><a className="flink hover:text-white" href="/borrow">Mượn sách</a></li>
                <li><a className="flink hover:text-white" href="/wishlist">Yêu thích</a></li>
                <li><a className="flink hover:text-white" href="/orders">Đơn hàng</a></li>
                <li><a className="flink hover:text-white" href="/about">Giới thiệu</a></li>
              </ul>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-white">
                <LuMail className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="font-medium">Đăng ký nhận bản tin</h3>
              </div>
              <p className="mt-2 text-sm text-slate-400">Nhận cập nhật mới nhất, tuyển chọn hay và sự kiện đặc biệt.</p>

              <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
                <label className="sr-only" htmlFor="nl-email">Địa chỉ email</label>
                <input
                  id="nl-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ban@example.com"
                  className="flex-1 rounded-lg bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none ring-1 ring-inset ring-white/15 focus:ring-2 focus:ring-primary"
                  aria-label="Địa chỉ email"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  aria-label="Đăng ký nhận bản tin"
                  className="btn-glow inline-flex min-h-11 min-w-11 items-center justify-center whitespace-nowrap rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-black transition focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70"
                >
                  {submitting ? "Đang đăng ký…" : "Đăng ký"}
                </button>
              </form>

              {/* Social icons */}
              <div className="mt-5 flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="NovaLibrary trên Facebook"
                  className="icon-lift inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-slate-300 ring-1 ring-white/10 hover:text-white"
                >
                  <LuFacebook className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="NovaLibrary trên Twitter"
                  className="icon-lift inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-slate-300 ring-1 ring-white/10 hover:text-white"
                >
                  <LuTwitter className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="NovaLibrary trên Instagram"
                  className="icon-lift inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-slate-300 ring-1 ring-white/10 hover:text-white"
                >
                  <LuInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} NovaLibrary. Bảo lưu mọi quyền.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <a className="flink hover:text-white" href="/privacy">Chính sách bảo mật</a>
            <a className="flink hover:text-white" href="/terms">Điều khoản dịch vụ</a>
            <a className="flink hover:text-white" href="/contact">Liên hệ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;