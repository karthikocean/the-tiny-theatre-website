import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Tv, Volume2, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import { getScreens } from '../Api/screenapi';
import { getImageUrl } from '../Api/api';

export default function Screens({ preview, onViewMore }) {
  const navigate = useNavigate();
  const [screens, setScreens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const res = await getScreens();
        if (res && res.status && res.response && res.response.data) {
          // Filter active and non-deleted screens
          const activeScreens = res.response.data.filter(
            (screen) => screen.isActive === 1 && screen.isDelete === 0
          );
          setScreens(activeScreens);
        } else {
          setError('Failed to load screen configurations.');
        }
      } catch (err) {
        console.error('Error fetching screens:', err);
        setError('Something went wrong while fetching screens.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScreens();
  }, []);

  const handleBookScreen = (screenName) => {
    // Map screen name to 'A' or 'B' for the BookNow wizard
    const screenCode = screenName.toLowerCase().includes('b') ? 'B' : 'A';
    navigate('/book-now', { state: { selectedScreen: screenCode } });
  };

  // Hardcoded sub-features to keep visual aesthetics premium
  const getExtraFeatures = (screenName) => {
    if (screenName.toLowerCase().includes('b')) {
      return [
        { label: '4K Ultra HD Display', desc: 'Crisp & vivid visual quality' },
        { label: 'Dolby Surround 5.1', desc: 'Cinematic acoustics' },
        { label: 'Plush Sofa & Recliners', desc: 'Ultra comfortable luxury' },
        { label: 'Perfect for Couples', desc: 'Intimate date-night ambiance' },
      ];
    }
    return [
      { label: 'Giant Cinema Screen', desc: 'Grand scale immersive viewing' },
      { label: 'Immersive Surround Sound', desc: 'Room-filling powerful bass' },
      { label: 'Premium Luxury Seating', desc: 'Spacious leather recliners' },
      { label: 'Party-Ready Space', desc: 'Perfect for group milestones' },
    ];
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section id="screens" className="relative py-24  bg-gradient-to-b from-theatre-dark to-theatre-dark/95 overflow-hidden" style={{display:"none"}}>
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-theatre-gold/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-theatre-grey/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs sm:text-sm mb-4 block">
            Our Private Screening Halls
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Choose Your Private <span className="text-transparent bg-clip-text bg-gradient-to-r from-theatre-gold via-theatre-gold-light to-theatre-gold text-shadow-gold">Cinema Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full mb-6" />
          <p className="text-gray-400 text-sm sm:text-base font-sans font-light leading-relaxed">
            Step into a world of exclusivity. Whether it's an intimate date night or a grand celebration, we have the perfect private screen tailored to your requirements.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {[1, 2].map((n) => (
              <div key={n} className="rounded-3xl border border-white/5 bg-theatre-grey-deep/10 p-6 space-y-6 animate-pulse">
                <div className="h-64 bg-white/5 rounded-2xl w-full" />
                <div className="h-6 bg-white/5 rounded w-1/3" />
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-5/6" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-white/5 rounded-xl" />
                  <div className="h-10 bg-white/5 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="max-w-md mx-auto p-6 bg-red-950/20 border border-red-500/30 rounded-2xl flex flex-col items-center text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <h3 className="text-white font-serif font-bold text-lg">Unable to Fetch Screens</h3>
            <p className="text-gray-400 text-sm font-sans">{error}</p>
          </div>
        )}

        {/* Screens Grid */}
        {!isLoading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 max-w-5xl mx-auto"
          >
            {screens.map((screen) => {
              const extraFeatures = getExtraFeatures(screen.name);
              return (
                <motion.div
                  key={screen._id}
                  variants={cardVariants}
                  className="glass rounded-3xl border border-theatre-gold/30 hover:border-theatre-gold/80 transition-all duration-500 flex flex-col overflow-hidden group hover:shadow-2xl hover:shadow-theatre-gold/5 relative"
                >
                  {/* Screen Image Container */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-theatre-grey-deep/40">
                    <div className="absolute inset-0 bg-gradient-to-t from-theatre-dark via-transparent to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
                    <img
                      src={getImageUrl(screen.image?.path || screen.image)}
                      alt={screen.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = screen.name.toLowerCase().includes('b')
                          ? 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=800&q=80'
                          : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    
                    {/* Capacity Badge */}
                    <div className="absolute top-4 left-4 z-20 bg-theatre-dark/85 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg">
                      <Users className="w-4 h-4 text-theatre-gold" />
                      <span>Up to {screen.capacity} Guests</span>
                    </div>

                    {/* Suite Name Badge */}
                    <div className="absolute top-4 right-4 z-20 bg-theatre-gold text-theatre-grey-deep px-4 py-1.5 rounded-xl font-bold font-sans text-xs shadow-lg uppercase tracking-wider">
                      {screen.name.toLowerCase().includes('b') ? 'Cozy Suite' : 'Grand Hall'}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-theatre-gold transition-colors duration-300">
                        {screen.name}
                      </h3>
                      
                      <p className="text-gray-400 text-sm font-sans font-light leading-relaxed min-h-[72px]">
                        {screen.description}
                      </p>

                      <div className="w-full h-px bg-white/5" />

                      {/* Dynamic highlights */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {extraFeatures.map((feat, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Sparkles className="w-4 h-4 text-theatre-gold/80 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-xs font-semibold text-white">{feat.label}</h4>
                              <p className="text-[10px] text-gray-500">{feat.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleBookScreen(screen.name)}
                        className="flex-1 bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:shadow-theatre-gold/25 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer scale-100 hover:scale-[1.02]"
                      >
                        <span>Book {screen.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* View All Button for Preview */}
        {preview && !isLoading && !error && (
          <div className="text-center mt-16">
            <button
              onClick={onViewMore}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep font-bold px-8 py-4 rounded-full shadow-lg shadow-theatre-gold/15 hover:shadow-theatre-gold/25 hover:scale-105 transition-all duration-300 text-sm cursor-pointer"
            >
              <span>Explore All Screens</span>
              <span className="text-xs">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
