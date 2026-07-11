import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonialsData = [
  {
    id: 1,
    name: 'Sophia Carter',
    role: 'Romantic Proposal Host',
    review: 'The Dolby Atmos acoustics and 4K projection made our anniversary proposal night spectacular! The team pre-decorated the space beautifully. Complete magic.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 2,
    name: 'Andrew Miller',
    role: 'Tech Director & Corporate Host',
    review: 'We held our team\'s quarterly get-together and client presentation here. Very professional setup, luxury recliners, and zero distractions. Highly recommended!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 3,
    name: 'Jessica Davis',
    role: 'Happy Parent',
    review: 'Booked a private screening for my son\'s birthday party. The custom balloon setups, mocktails, and popcorn tubs made the kids ecstatic. Truly a 5-star experience.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const current = testimonialsData[activeIndex];

  return (
    <section 
      id="testimonials" 
      className="relative py-12 bg-gradient-to-b from-theatre-dark/95 to-theatre-dark overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-theatre-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs mb-4 block">
            Guest Reviews
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            What Our <span className="text-theatre-grey">Guests Say</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full" />
        </div>

        {/* Carousel Slider Card Container */}
        <div className="relative min-h-[380px] sm:min-h-[320px] flex items-center justify-center">
          
          {/* Left Arrow Icon */}
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:-left-16 z-20 p-3 rounded-full bg-theatre-grey/10 hover:bg-theatre-gold text-gray-400 hover:text-theatre-grey-deep border border-white/5 hover:border-theatre-gold transition-all duration-300 shadow-md cursor-pointer hover:scale-105"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Review Card */}
          <div className="w-full overflow-hidden px-4">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="bg-theatre-grey-deep/15 backdrop-blur-md rounded-[32px] p-8 sm:p-10 border border-theatre-gold/45 hover:border-theatre-gold/80 flex flex-col justify-between transition-all duration-300 shadow-xl"
              >
                <div className="space-y-6">
                  {/* Quote Icon and Rating */}
                  <div className="flex justify-between items-center">
                    <Quote className="w-10 h-10 text-theatre-gold/20" />
                    <div className="flex space-x-1">
                      {[...Array(current.rating)].map((_, i) => (
                        <Star key={i} className="w-4.5 h-4.5 fill-theatre-gold text-theatre-gold" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-200 text-base sm:text-lg leading-relaxed font-sans font-light italic">
                    "{current.review}"
                  </p>
                </div>

                {/* Reviewer Profile */}
                <div className="flex items-center space-x-4 pt-6 mt-8 border-t border-white/10">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-theatre-gold/20 shadow-md"
                  />
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white">
                      {current.name}
                    </h4>
                    <p className="text-xs text-gray-500 font-sans tracking-wide uppercase font-semibold">
                      {current.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow Icon */}
          <button
            onClick={handleNext}
            className="absolute right-0 sm:-right-16 z-20 p-3 rounded-full bg-theatre-grey/10 hover:bg-theatre-gold text-gray-400 hover:text-theatre-grey-deep border border-white/5 hover:border-theatre-gold transition-all duration-300 shadow-md cursor-pointer hover:scale-105"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Indicators/Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === index ? 'bg-theatre-gold w-6' : 'bg-white/20 w-2 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
