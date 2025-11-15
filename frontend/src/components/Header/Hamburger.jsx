import { HiMiniBars3CenterLeft, HiXMark } from "react-icons/hi2";

export default function Hamburger({ isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? "Đóng menu" : "Mở menu"}
      aria-expanded={isOpen}
      className="p-2 rounded-md text-slate-700 hover:text-primary transition-transform group"
    >
      <div className="relative w-6 h-6">
        {isOpen ? (
          <HiXMark className="w-6 h-6 transform transition duration-150" />
        ) : (
          <HiMiniBars3CenterLeft className="w-6 h-6 transform transition duration-150" />
        )}
      </div>
    </button>
  );
}
