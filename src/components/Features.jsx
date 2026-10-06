import React from 'react';
import { Tv, Film, Camera, Popcorn, Car, MapPin, Sparkles, Gift, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const featuresData = [
  {
    id: 1,
    title: 'Luxe Screen',
    description: 'Enjoy a crisp 4K picture with Dolby Atmos 7.1.2 sound for an immersive movie experience.',
    icon: Tv
  },
  {
    id: 2,
    title: 'Plush Screen',
    description: 'Settle in with a 2K picture and Dolby Atmos 5.1.2 sound in a cosy setting.',
    icon: Film
  },
  {
    id: 3,
    title: 'A Space to Hang Out',
    description: 'Enjoy a dedicated outdoor area to relax, have fun and share snacks, with a photo point that is insta-worthy.',
    icon: Camera
  },
  {
    id: 4,
    title: 'Treats for Everyone',
    description: 'Choose from Savouries, Confectionaries, Beverages and Ice-creams at affordable prices.',
    icon: Popcorn
  },
  {
    id: 5,
    title: 'Easy Parking',
    description: 'A large public parking area is available, so parking is one less thing to worry about.',
    icon: Car
  },
  {
    id: 6,
    title: 'Easy to Reach',
    description: 'We’re on the third floor, with lift access available.',
    icon: MapPin
  },
  {
    id: 7,
    title: 'Décor for Your Occasion',
    description: 'Fixed decorations are part of the experience, with optional décor choices available too.',
    icon: Sparkles
  },
  {
    id: 8,
    title: 'Make It Extra Special',
    description: 'Add-ons are available to make birthdays, celebrations and other special moments memorable.',
    icon: Gift
  }
];

export default function Features({ preview = false }) {
  const navigate = useNavigate();

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

        {/* Features Grid */}
        <div
          className={
            preview
              ? "grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          }
        >
          {displayFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-theatre-grey-deep/15 backdrop-blur-md rounded-[32px] p-8 border border-theatre-gold/20 hover:border-theatre-gold/80 flex flex-col items-center text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-2 group relative w-full h-full"
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
          <div className="mt-12 text-center">
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
