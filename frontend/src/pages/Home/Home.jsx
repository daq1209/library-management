// src/pages/Home/Home.jsx
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Banner from "./Banner";
import TopSellers from "./TopSellers";
import Recommended from "./Recommended";
import News from "./News";
export default function Home() {
  const [params] = useSearchParams();

  useEffect(() => {
    const section = params.get("section");
    if (!section) return;
    // Defer to next frame to ensure sections are rendered
    const id = section.toLowerCase();
    const run = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    const raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [params]);
  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 pt-6 md:pt-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary text-center">
          NOVALIBRARY
        </h1>
      </section>

      <section className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12">
        <Banner />
      </section>

      <section id="top-sellers">
        <TopSellers />
      </section>

    {/* TopRead section removed per request */}
    <section id="recommended" className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 pb-16">
         <Recommended/> 
      </section>
    <section id="news" className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 pb-16">
         <News/>
      </section>
    </main>
  );
}
