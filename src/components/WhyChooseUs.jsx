import React, { useRef } from 'react';
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
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    scrollRef.current.classList.add('cursor-grabbing');
    scrollRef.current.classList.remove('cursor-grab', 'snap-x', 'snap-mandatory', 'scroll-smooth');
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.classList.remove('cursor-grabbing');
      scrollRef.current.classList.add('cursor-grab', 'snap-x', 'snap-mandatory', 'scroll-smooth');
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.classList.remove('cursor-grabbing');
      scrollRef.current.classList.add('cursor-grab', 'snap-x', 'snap-mandatory', 'scroll-smooth');
    }
  };

  const handleMouseMove = (e) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

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
      desc: "From birthdays & anniversaries, to proposals, romantic dates, and surprise parties, we help making every occasion memorable with beautiful decoration.",
      image: imgPerfectForEveryCelebration
    },
    {
      title: "Perfect for every Get-together",
      desc: "From family reunions and friendly catch-ups, to corporate gatherings, our private theatre brings people together in a space that's comfortable,  exclusive and made for memorable moments",
      image: imgCorporateGatheringMeeting
    },
    {
      title: "Munch, Sip & Celebrate",
      desc: "Complete your celebration with a delicious selection of freshly made pop-corn, savouries, and refreshing beverages. indulgent cakes, and more - all available to make your experience even more special!",
      image: imgDeliciousCakesRefreshments
    },
    {
      title: "Comfort Meets Luxury",
      desc: "Relax in comfortable seating within a clean, stylish, and air-conditioned environment designed for a premium experience.",
      image: imgComfortMeetsLuxury
    },
    {
      title: "Memories Worth Remembering",
      desc: "More than just binge watch, we create unforgettable experiences filled with laughter, celebration and memories you'll treasure long after the credits roll",
      image: imgMemoriesThatLast
    },
    {
      title: "Seamless Service, Happy Moments",
      desc: "From the moment you book to the final moment of your celebration, our team is committed to making your experience effortless, enjoyable and truly memorable",
      image: imgFriendlyHassleFreeService
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
            At The Tiny Theatre, we believe every celebration deserves a private, comfortable, and unforgettable experience. Here's what makes us special
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          ref={preview ? scrollRef : null}
          onMouseDown={preview ? handleMouseDown : undefined}
          onMouseLeave={preview ? handleMouseLeave : undefined}
          onMouseUp={preview ? handleMouseUp : undefined}
          onMouseMove={preview ? handleMouseMove : undefined}
          className={
            preview
              ? "flex overflow-x-auto gap-6 lg:gap-8 max-w-7xl mx-auto pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar px-4 sm:px-6 scroll-pl-4 sm:scroll-pl-6 cursor-grab"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto pb-8"
          }
        >
          {features.map((feat, idx) => {
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className={`bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl border border-theatre-gold/45 hover:border-theatre-gold/80 flex flex-col transition-all duration-300 group cursor-default hover:shadow-xl hover:shadow-theatre-gold/5 relative overflow-hidden h-auto ${
                  preview ? "flex-none w-[75vw] sm:w-[320px] lg:w-[29%] xl:w-[29%] snap-start max-sm:min-h-[380px]" : "w-full"
                }`}
              >
                {/* Background/Header Image */}
                <div className={`relative w-full overflow-hidden z-0 ${preview ? 'max-sm:absolute max-sm:inset-0 max-sm:h-full h-56' : 'h-56'}`}>
                  <div className={`absolute inset-0 bg-gradient-to-t ${preview ? 'max-sm:from-theatre-dark max-sm:via-theatre-dark/70 max-sm:to-transparent from-theatre-dark/95 via-transparent to-transparent' : 'from-theatre-dark/95 via-transparent to-transparent'} z-10`} />
                  <img
                    src={feat.image}
                    alt={feat.title}
                    draggable="false"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-100 select-none pointer-events-none"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </div>

              {/* Content Area */}
              <div className="relative z-20 p-6 flex-grow flex flex-col justify-between h-auto">
                <div className={`${preview ? 'max-sm:mt-auto' : ''}`}>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-theatre-gold transition-colors duration-300 text-left">
                    {feat.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-sans font-light text-gray-300 text-left">
                    {feat.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

        {/* Action Button & Slogan */}
        <div className="text-center mt-12 flex flex-col items-center space-y-8">
          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-theatre-gold-light via-theatre-gold to-theatre-gold-dark font-semibold tracking-wide">
            "Because Every Celebration Deserves Its Own Spotlight."
          </p>
        </div>

      </div>
    </section>
  );
}
