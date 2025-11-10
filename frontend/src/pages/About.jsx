import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-12 bg-linear-to-b from-white to-slate-50">
      {/* Heading */}
      <motion.h1
        className="text-4xl md:text-5xl font-display font-bold text-primary mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About Our Library System
      </motion.h1>

      {/* Description */}
      <motion.p
        className="max-w-2xl text-slate-600 text-lg leading-relaxed mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Our Library Management System is designed to make book borrowing and
        management simpler, faster, and more efficient. Whether you are a reader
        searching for your next favorite book or an admin managing thousands of
        titles, our platform ensures a smooth and enjoyable experience.
      </motion.p>

      {/* Core Values */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {[
          {
            title: "📚 Smart Catalog",
            desc: "Easily browse, search, and filter books with an intuitive interface.",
          },
          {
            title: "⚡ Fast & Reliable",
            desc: "Optimized backend ensures quick response and real-time updates.",
          },
          {
            title: "🔒 Secure Access",
            desc: "Powered by Firebase Authentication to protect your account data.",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:shadow-md transition"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h3 className="text-xl font-semibold mb-2 text-primary-700">
              {item.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <Link
        to="/"
        className="btn-primary"
      >
        Back to Home
      </Link>
    </section>
  );
}
