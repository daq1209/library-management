import { Link } from "react-router-dom";

export default function Brand() {
  return (
    <Link
      to="/"
      className="text-xl font-display font-bold text-primary hover:text-yellow-400 transition-colors"
      aria-label="NovaLibrary - Trang chủ"
    >
      NovaLibrary
    </Link>
  );
}
