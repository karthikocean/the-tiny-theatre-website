import React from "react";

const Testimonials = () => {
  return (
    <section className="py-24 bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="uppercase tracking-[4px] text-[#FFC512] text-sm">
          What Our Guests Say
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
          Testimonials
        </h2>
        {/* Placeholder cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#151515] rounded-2xl p-6 text-left glass hover:scale-105 transition-transform"
            >
              <p className="text-gray-400 italic mb-4">
                “A magical experience that exceeded every expectation.”
              </p>
              <p className="text-white font-semibold">Guest {i}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
