import React, { useRef } from 'react';
import { Projector, Speaker, Tv, Bluetooth, Lightbulb, Armchair, Mic, Cake, Popcorn, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const featuresData = [
  {
    id: 1,
    title: '4K Ultra HD Projection',
    description: 'Enjoy your favourite movies and videos in stunning 4K quality with sharp, clear, and detailed visuals on the big screen.',
    icon: Projector
  },
  {
    id: 2,
    title: 'Immersive Sound Experience',
    description: 'Feel every dialogue, song, and action with rich and powerful sound that makes you feel part of the movie.',
    icon: Speaker
  },
  {
    id: 3,
    title: 'Smart OTT Streaming',
    description: 'Watch your favourite movies and shows from supported OTT platforms and enjoy them on the big screen.',
    icon: Tv
  },
  {
    id: 4,
    title: 'Bluetooth Audio Connectivity',
    description: 'Connect your smartphone or compatible device easily and enjoy your favourite music, playlists, and audio.',
    icon: Bluetooth
  },
  {
    id: 5,
    title: 'Smart Lighting Control',
    description: 'Set the perfect mood with adjustable lighting that lets you create the right atmosphere for your movie or occasion.',
    icon: Lightbulb
  },
  {
    id: 6,
    title: 'Customizable Seating Arrangement',
    description: 'Enjoy a flexible seating setup that can be arranged to suit your group and make your time at the theatre more comfortable.',
    icon: Armchair
  },
  {
    id: 7,
    title: 'Karaoke & Music Setup',
    description: 'Sing along to your favourite songs and enjoy a fun-filled music experience with our karaoke and music setup.',
    icon: Mic
  },
  {
    id: 8,
    title: 'Celebration Cakes',
    description: 'Make your special occasion even sweeter with delicious cakes available to complement your celebration.',
    icon: Cake
  },
  {
    id: 9,
    title: 'Snacks & Refreshments',
    description: 'Enjoy a variety of tasty snacks and refreshing drinks while relaxing and enjoying your time at the theatre.',
    icon: Popcorn
  }
];

export default function Features({ preview = false }) {
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

  const displayFeatures = preview ? featuresData.slice(0, 3) : featuresData;

  return (
    <section
      id="features"
      className="relative py-16 bg-gradient-to-b from-theatre-dark to-theatre-dark/95 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-theatre-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs mb-4 block">
            What We Offer
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            Our Theatre <span className="text-theatre-grey">Features</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full" />
        </div>

        {/* Features Grid / Carousel */}
        <div
          ref={preview ? scrollRef : null}
          onMouseDown={preview ? handleMouseDown : undefined}
          onMouseLeave={preview ? handleMouseLeave : undefined}
          onMouseUp={preview ? handleMouseUp : undefined}
          onMouseMove={preview ? handleMouseMove : undefined}
          className={
            preview
              ? "flex items-stretch overflow-x-auto gap-6 lg:gap-8 max-w-7xl mx-auto pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar px-4 sm:px-6 scroll-pl-4 sm:scroll-pl-6 cursor-grab"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          }
        >
          {displayFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className={`bg-theatre-grey-deep/15 backdrop-blur-md rounded-[32px] p-8 border border-theatre-gold/20 hover:border-theatre-gold/80 flex flex-col items-center text-center transition-all duration-300 shadow-lg hover:shadow-xl group relative ${preview ? "flex-none w-[75vw] sm:w-[320px] lg:w-[29%] xl:w-[29%] snap-start h-auto" : "w-full hover:-translate-y-2 h-full"
                  }`}
              >
                <div className="w-16 h-16 rounded-full bg-theatre-gold/10 flex items-center justify-center mb-6 group-hover:bg-theatre-gold/20 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-theatre-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-serif">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* View All Button (Preview Only) */}
        {preview && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                navigate('/features');
                window.scrollTo(0, 0);
              }}
              className="inline-flex items-center space-x-2 bg-transparent hover:bg-theatre-gold/10 text-theatre-gold border border-theatre-gold px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <span>View All Features</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
