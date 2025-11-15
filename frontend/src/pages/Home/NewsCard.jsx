import { Link } from "react-router-dom";

export default function NewsCard({ item }) {
  const isExternal = item.url && (item.url.startsWith("http://") || item.url.startsWith("https://"));

  const cardContent = (
    <>
      <div className="news-card__row">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 hover:text-primary transition line-clamp-2">
            {item.title}
          </h3>
          <p className="text-[12px] text-slate-500 mt-1">
            {item.source ?? "Library News"} • {item.publishedAt ?? "just now"}
          </p>
          <p className="news-card__summary text-sm text-slate-600 mt-2">
            {item.summary}
          </p>
        </div>

        <div className="news-card__thumb">
          <img src={item.thumb} alt={item.title} loading="lazy" decoding="async" />
        </div>
      </div>

      {/* Đẩy CTA xuống đáy card */}
      <div className="mt-auto pt-4">
        <span className="text-[13px] text-primary hover:underline inline-flex items-center gap-1">
          Read more <span aria-hidden>→</span>
        </span>
      </div>
    </>
  );

  if (isExternal) {
    return (
      <article 
        className="news-card bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition"
      >
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {cardContent}
        </a>
      </article>
    );
  }

  return (
    <Link
      to={item.url || "#"}
      className="block"
    >
      <article className="news-card bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition">
        {cardContent}
      </article>
    </Link>
  );
}
