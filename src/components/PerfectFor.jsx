import React from 'react';
import { motion } from 'framer-motion';

// NOTE: These local images (e.g. /movie.png, /birthday.png) are placeholders and will be replaced in future once our theatre setup is ready.
export default function PerfectFor() {
  const perfectFor = [
    {
      name: "Movie Marathons",
      image: "/movie.png"
    },
    {
      name: "Birthday Celebrations",
      image: "/birthday.png"
    },
    {
      name: "Romantic Date Nights",
      image: "/romantic date.png"
    },
    {
      name: "Proposals",
      image: "/proposal.png"
    },
    {
      name: "Anniversaries",
      image: "/anniversary.png"
    },
    {
      name: "Family Gatherings",
      image: "/family.png"
    },
    {
      name: "Team Celebrations",
      image: "/team.png"
    }
  ];

  return (
    <section id="perfect-for" className="relative py-12 bg-theatre-dark overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-theatre-grey/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-theatre-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs mb-4 block">
            Occasions
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Perfect <span className="text-theatre-gold">For</span>
          </h3>
          <div className="w-14 h-0.5 bg-theatre-gold rounded-full" />
        </div>

        {/* Perfect For Image Cards Grid - Centered Flexbox */}
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
          {perfectFor.map((item, idx) => {
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="relative w-full sm:w-[270px] h-80 rounded-3xl overflow-hidden border border-theatre-gold/40 hover:border-theatre-gold transition-all duration-300 hover:scale-105 shadow-lg group cursor-pointer"
              >
                {/* Card Background Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                {/* Gradient Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-theatre-dark via-theatre-dark/45 to-transparent z-10" />

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end items-center text-center">
                  <h4 className="text-white text-center font-serif font-bold text-lg sm:text-xl leading-tight tracking-wide group-hover:text-theatre-gold transition-colors duration-300">
                    {item.name}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
