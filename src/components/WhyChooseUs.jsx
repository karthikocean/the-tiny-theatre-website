import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// NOTE: These local images are placeholders and will be replaced in future once our theatre setup is ready.
// Import local images from src/assets
import imgExclusivePrivateTheatre from '../assets/Exclusive-Private-Theatre.webp';
import imgCinemaQualityAudioVisuals from '../assets/Cinema-Quality-Audio-and-Visuals.webp';
import imgPerfectForEveryCelebration from '../assets/Perfect-for-Every-Celebration.jpeg';
import imgDeliciousCakesRefreshments from '../assets/Delicious-Cakes-and-Refreshments.png';
import imgComfortMeetsLuxury from '../assets/comforts.png';
import imgMemoriesThatLast from '../assets/Memories-That-Last.jpg';
import imgFriendlyHassleFreeService from '../assets/hasslefreeservice.png';
import imgCorporateGatheringMeeting from '../assets/corporate-meetings.png';

export default function WhyChooseUs({ preview, onViewMore }) {
  const navigate = useNavigate();

  const features = [
    {
      title: "Exclusive Private Theatre",
      desc: "Enjoy the entire theatre exclusively with your family, friends, or loved ones—no strangers, no interruptions.",
      image: imgExclusivePrivateTheatre
    },
    {
      title: "Cinema-Quality Audio & Visuals",
      desc: "Experience your favourite movies, shows, and music on a giant screen with immersive sound that brings every moment to life.",
      image: imgCinemaQualityAudioVisuals
    },
    {
      title: "Perfect for Every Celebration",
      desc: "From birthdays and anniversaries to proposals, date nights, family gatherings, and surprise parties, we help make every occasion memorable.",
      image: imgPerfectForEveryCelebration
    },
    {
      title: "Delicious Cakes & Refreshments",
      desc: "Complete your celebration with popcorn, snacks, beverages, delicious cakes, and other treats available as part of your experience.",
      image: imgDeliciousCakesRefreshments
    },
    {
      title: "Comfort Meets Luxury",
      desc: "Relax in comfortable seating within a clean, stylish, and air-conditioned environment designed for a premium experience.",
      image: imgComfortMeetsLuxury
    },
    {
      title: "Memories That Last",
      desc: "We don't just provide a movie screen—we create moments that you'll cherish long after the credits roll.",
      image: imgMemoriesThatLast
    },
    {
      title: "Friendly & Hassle-Free Service",
      desc: "Our team is dedicated to ensuring your booking, celebration, and overall experience are smooth, enjoyable, and stress-free.",
      image: imgFriendlyHassleFreeService
    },
    {
      title: "Corporate Gathering and Meeting",
      desc: "Be it hosting a presentation or enjoying a day out with your team, we provide the best amenities and service.",
      image: imgCorporateGatheringMeeting
    }
  ];

  const previewFeatures = features.slice(0, 3);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 14,
      },
    },
  };

  return (
    <section id="why-choose-us" className="relative py-12 bg-gradient-to-b from-theatre-dark to-theatre-dark/95 overflow-hidden">
      {/* Premium ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-theatre-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-theatre-grey/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs sm:text-sm mb-4 block">
            Why Choose The Tiny Theatre?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            Designed for Unforgettable <span className="text-theatre-gold">Experiences</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full mb-8" />
          <p className="text-gray-400 text-sm sm:text-base font-sans font-light leading-relaxed">
            At The Tiny Theatre, we believe every celebration deserves a private, comfortable, and unforgettable experience. Here's what makes us special:
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className={`grid gap-8 ${
            preview 
              ? 'grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto'
          }`}
        >
          {(preview ? previewFeatures : features).map((feat, idx) => {
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl border border-theatre-gold/45 hover:border-theatre-gold/80 flex flex-col transition-all duration-300 group cursor-default hover:shadow-xl hover:shadow-theatre-gold/5 relative overflow-hidden"
              >
                {/* Feature Header Image */}
                <div className="h-48 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-theatre-dark/60 via-transparent to-transparent z-10" />
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </div>

              {/* Content Area */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white mb-2.5 group-hover:text-theatre-gold transition-colors duration-300 text-center">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-sans font-light text-left">
                    {feat.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

        {/* Action Button & Slogan */}
        <div className="text-center mt-20 flex flex-col items-center space-y-8">
          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-theatre-gold-light via-theatre-gold to-theatre-gold-dark font-semibold tracking-wide">
            "Because Every Celebration Deserves Its Own Spotlight."
          </p>
          
          {preview && (
            <button
              onClick={onViewMore}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep font-bold px-8 py-4 rounded-full shadow-lg shadow-theatre-gold/15 hover:shadow-theatre-gold/25 hover:scale-105 transition-all duration-300 text-sm cursor-pointer"
            >
              <span>View All Features</span>
              <span className="text-xs">→</span>
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
