import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getOccasions } from '../Api/occasionsapi';
import { getImageUrl } from '../Api/api';

export default function PerfectFor() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  const hardcodedFallback = [
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

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const res = await getOccasions();
        if (res && res.status && res.response && res.response.data) {
          const activeOccasions = res.response.data.filter(
            (occ) => occ.isActive === 1 && occ.isDelete === 0
          );
          setOccasions(activeOccasions);
        }
      } catch (err) {
        console.error('Error fetching occasions in PerfectFor:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOccasions();
  }, []);

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

  const handleCardClick = (name) => {
    navigate('/book-now', { state: { selectedOccasion: name } });
  };

  const displayOccasions = occasions.length > 0
    ? occasions.map(occ => ({
        name: occ.name,
        image: occ.image ? getImageUrl(occ.image) : "/movie.png"
      }))
    : (loading ? [] : hardcodedFallback);

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

        {/* Perfect For Image Cards — Drag-Scrollable Carousel (all viewports) */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex overflow-x-auto gap-6 lg:gap-8 max-w-7xl mx-auto pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar px-4 sm:px-6 scroll-pl-4 sm:scroll-pl-6 cursor-grab"
        >
          {displayOccasions.map((item, idx) => {
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                onClick={() => handleCardClick(item.name)}
                draggable="false"
                className="relative flex-none w-[75vw] sm:w-[280px] h-80 rounded-3xl overflow-hidden border border-theatre-gold/40 hover:border-theatre-gold transition-all duration-300 hover:scale-105 shadow-lg group cursor-pointer snap-start select-none"
              >
                {/* Card Background Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  draggable="false"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 select-none pointer-events-none"
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
