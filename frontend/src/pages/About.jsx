import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { FaBookOpenReader, FaBolt, FaShieldHalved } from "react-icons/fa6";
import { LuSparkles, LuBookOpen, LuStar } from "react-icons/lu";

// Animated counter hook
function useCounter(end, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!shouldStart) return;
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);
  
  return count;
}

// Floating decoration component
function FloatingIcon({ children, delay = 0, duration = 4 }) {
  return (
    <motion.div
      className="absolute text-primary/10"
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        y: [-20, 20, -20],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

// Stat card component
function StatCard({ end, label, suffix = "", shouldAnimate }) {
  const count = useCounter(end, 2000, shouldAnimate);
  
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-slate-600 text-sm md:text-base">{label}</div>
    </motion.div>
  );
}

export default function About() {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <FaBookOpenReader className="w-7 h-7" />,
      title: "Smart Catalog",
      desc: "Easily browse, search, and filter books with an intuitive interface.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaBolt className="w-7 h-7" />,
      title: "Fast & Reliable",
      desc: "Optimized backend ensures quick response and real-time updates.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <FaShieldHalved className="w-7 h-7" />,
      title: "Secure Access",
      desc: "Powered by Firebase Authentication to protect your account data.",
      color: "from-emerald-500 to-teal-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      {/* Floating decorations */}
      <FloatingIcon delay={0} duration={5}>
        <LuSparkles className="w-12 h-12" style={{ position: 'absolute', top: '10%', left: '5%' }} />
      </FloatingIcon>
      <FloatingIcon delay={1} duration={6}>
        <LuBookOpen className="w-16 h-16" style={{ position: 'absolute', top: '15%', right: '8%' }} />
      </FloatingIcon>
      <FloatingIcon delay={2} duration={5.5}>
        <LuStar className="w-10 h-10" style={{ position: 'absolute', bottom: '20%', left: '10%' }} />
      </FloatingIcon>
      <FloatingIcon delay={1.5} duration={7}>
        <LuBookOpen className="w-14 h-14" style={{ position: 'absolute', bottom: '30%', right: '12%' }} />
      </FloatingIcon>

      {/* Hero Section */}
      <section className="relative max-w-screen-xl mx-auto px-6 py-20 md:py-28 text-center">
        {/* Glow effect behind title */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <LuSparkles className="w-4 h-4" />
            Hệ thống thư viện hiện đại
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 mb-6 leading-tight">
            Về {" "}
            <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent">
              NovaLibrary
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-slate-600 text-lg md:text-xl leading-relaxed mb-12">
            Hệ thống NovaLibrary được thiết kế để việc mượn và quản lý sách trở nên
            <span className="font-semibold text-slate-800">đơn giản, nhanh chóng và hiệu quả</span>.
            Dù bạn là độc giả đang tìm cuốn sách yêu thích tiếp theo hay là quản trị viên
            quản lý hàng nghìn đầu sách, nền tảng của chúng tôi luôn mang lại trải nghiệm mượt mà và thú vị.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="max-w-screen-xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          <StatCard end={10000} label="Sách hiện có" suffix="+" shouldAnimate={statsInView} />
          <StatCard end={2000} label="Độc giả hoạt động" suffix="+" shouldAnimate={statsInView} />
          <StatCard end={500} label="Giao dịch mỗi ngày" suffix="+" shouldAnimate={statsInView} />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
            Vì sao chọn NovaLibrary?
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Xây dựng bằng công nghệ hiện đại để mang lại quản trị thư viện thông minh, nhanh và an toàn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              {/* Icon with gradient background */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title === 'Smart Catalog' ? 'Danh mục thông minh' : feature.title === 'Fast & Reliable' ? 'Nhanh và ổn định' : feature.title === 'Secure Access' ? 'Truy cập an toàn' : feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                {feature.desc === 'Easily browse, search, and filter books with an intuitive interface.'
                  ? 'Dễ dàng duyệt, tìm kiếm và lọc sách với giao diện trực quan.'
                  : feature.desc === 'Optimized backend ensures quick response and real-time updates.'
                  ? 'Backend tối ưu giúp phản hồi nhanh và cập nhật tức thời.'
                  : feature.desc === 'Powered by Firebase Authentication to protect your account data.'
                  ? 'Sử dụng xác thực Firebase để bảo vệ dữ liệu tài khoản của bạn.'
                  : feature.desc}
              </p>

              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-16 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary/10 via-amber-50 to-primary/5 rounded-3xl p-12 md:p-16 border border-primary/20"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
            Sẵn sàng khám phá?
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-xl mx-auto">
            Khám phá hàng nghìn đầu sách và bắt đầu hành trình đọc của bạn với NovaLibrary ngay hôm nay.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <LuSparkles className="w-5 h-5" />
            Về trang chủ
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
