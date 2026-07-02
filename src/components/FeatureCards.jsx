import React from "react";

const FeatureCards = () => {
  return (
    <section className="py-24 bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="uppercase tracking-[4px] text-[#FFC512] text-sm">
          Premium Features
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
          Our Exclusive Offerings
        </h2>
        {/* Placeholder cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#151515] rounded-2xl p-6 glass hover:scale-105 transition-transform"
            >
              <div className="text-3xl mb-4 text-[#FFC512]">★</div>
              <h3 className="text-white font-semibold mb-2">Feature {i}</h3>
              <p className="text-gray-400">Brief description of feature {i} highlighting luxury and cinematic experience.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
