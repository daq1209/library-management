// src/pages/Home/Home.jsx
import React from "react";
import Banner from "./Banner";
import TopRead from "./TopRead";
import Recommended from "./Recommended";
import News from "./News";
export default function Home() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 pt-6 md:pt-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary text-center">
          THƯ VIỆN SYBAU
        </h1>
      </section>

      <section className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12">
        <Banner />
      </section>

      <section className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 pb-16">
         <TopRead/> 
      </section>
      <section className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 pb-16">
         <Recommended/> 
      </section>
      <section className="max-w-screen-2xl mx-auto px-6 md:px-10 lg:px-12 pb-16">
         <News/>
      </section>
    </main>
  );
}
