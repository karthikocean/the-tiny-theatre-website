import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Ticket, Clapperboard, Popcorn, Heart } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-[75vh] sm:min-h-screen flex items-center overflow-hidden bg-theatre-dark pt-16 sm:pt-0 pb-4 sm:pb-0">
      {/* Background Theatre Image & Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('/banner.png')`,
        }}
      />
      {/* Dark gradient mask - strong on the left for maximum readability, fading to transparent on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 lg:via-black/35 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent z-10" />
      <div className="absolute inset-0 bg-radial-gradient-hero z-10 opacity-50 pointer-events-none" />

      {/* Interactive stage spotlights */}
      <div className="absolute top-0 left-1/4 w-[35vw] h-[80vh] bg-gradient-to-b from-theatre-gold/10 to-transparent transform -rotate-12 blur-3xl pointer-events-none z-10" />
      <div className="absolute top-0 right-1/4 w-[25vw] h-[80vh] bg-gradient-to-b from-theatre-grey/5 to-transparent transform rotate-12 blur-3xl pointer-events-none z-10" />

      {/* Main Responsive Grid Layout */}
      <div className="relative z-20 max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-24 lg:pt-32 pb-4 sm:pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
          
          {/* Left Column: Centered on mobile, Left-aligned on Desktop */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-center lg:items-start justify-center text-center lg:text-left pl-0 lg:pl-14">
            
            {/* Experience Cinema Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="inline-flex items-center space-x-2 border border-theatre-gold text-theatre-gold px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6 bg-theatre-dark/20 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-theatre-gold" />
              <span>Experience Cinema, Your Way</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3 sm:mb-4 leading-[1.1]"
            >
              Where Every Celebration <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-theatre-gold via-theatre-gold-light to-theatre-gold text-shadow-gold">
                Becomes a Blockbuster
              </span>
            </motion.h1>

            {/* Gold Star Divider Line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center space-x-4 mb-4 sm:mb-6 w-full max-w-xs justify-center lg:justify-start origin-center lg:origin-left"
            >
              <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-theatre-gold" />
              <span className="text-theatre-gold text-xs">★</span>
              <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-theatre-gold" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="text-xs sm:text-sm text-gray-300 max-w-lg mb-4 sm:mb-6 leading-relaxed font-sans font-light text-center lg:text-justify"
            >
              Escape the crowds and enjoy your own private cinema with your favorite people. Whether 
              it's a birthday, anniversary, proposal, date night, bride to be, family gathering, corporate 
              events, or a surprise celebration, The Tiny Theatre offers an exclusive luxury theatre 
              experience designed just for you.
            </motion.p>

            {/* Movies, Munchies, Memories Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className="flex items-center justify-between border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-xl p-2.5 sm:p-3.5 w-full max-w-sm mb-5 sm:mb-6"
            >
              <div className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 flex-1">
                <Clapperboard className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-theatre-gold flex-shrink-0" />
                <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wider sm:tracking-widest uppercase">Movies</span>
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <div className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 flex-1">
                <Popcorn className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-theatre-gold flex-shrink-0" />
                <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wider sm:tracking-widest uppercase">Munchies</span>
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <div className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 flex-1">
                <Heart className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-theatre-gold flex-shrink-0" />
                <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wider sm:tracking-widest uppercase">Memories</span>
              </div>
            </motion.div>

            {/* Action Button & handwritten cursive text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 w-full"
            >
              <a
                href="/book-now"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/book-now');
                }}
                className="group flex items-center justify-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep font-bold px-3.5 py-3 rounded-lg shadow-xl shadow-theatre-gold/15 hover:shadow-theatre-gold/25 hover:scale-102 transition-all duration-300 text-[11px] sm:text-sm w-auto flex-shrink-0"
              >
                <Ticket className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-theatre-grey-deep group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
                <span className="cursor-pointer">Book Your Private Show</span>
              </a>

              {/* Hand-drawn style curved arrow pointing to the left */}
              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
                <svg className="w-7 h-4 sm:w-10 sm:h-6 text-theatre-gold flex-shrink-0 translate-y-0.5" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M45 5C30 15 18 20 6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 21L5 15L12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-signature text-[14px] sm:text-lg text-theatre-gold tracking-wide leading-tight text-left block">
                  Your movie.<br />
                  Your people.<br />
                  Your moment.
                </span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Empty to display background theatre */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6" />

        </div>
      </div>

      {/* Decorative Golden Fringe Banner line */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-theatre-gold to-transparent opacity-40 z-20" />
    </section>
  );
}
