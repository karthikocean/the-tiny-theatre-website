import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

export const eventsData = [
  {
    id: 1,
    name: 'Romantic Proposal Surprise',
    category: 'Romance',
    date: 'Select Any Date',
    time: '3-Hour Private Slot',
    venue: 'Rose Screen (Deluxe Couple Suite)',
    desc: 'Celebrate your special milestone with customized flower decorations, fairy lights, LED letters, a photography setup, and a private projection of your personal memory reel.',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
    price: '$120',
  },
  {
    id: 2,
    name: 'Grand Birthday Celebration',
    category: 'Celebrations',
    date: 'Select Any Date',
    time: '3-Hour Private Slot',
    venue: 'Crown Screen (Party Hall - up to 15 Guests)',
    desc: 'Book a private cinema party complete with customizable balloon arches, high-quality audio for cake cutting, photo backdrops, and your choice of movie or music video screenings.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    price: '$150',
  },
  {
    id: 3,
    name: 'Private Movie Night',
    category: 'Get Together',
    date: 'Select Any Date',
    time: '3-Hour Private Slot',
    venue: 'Screen 2 (Cosy Lounge - up to 6 Guests)',
    desc: 'Rent a private movie lounge for a family movie night, high-definition streaming, or watching movie marathons with complete privacy and premium popcorn tubs.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    price: '$90',
  },
  {
    id: 4,
    name: 'Family Get-Together & Reunions',
    category: 'Get Together',
    date: 'Select Any Date',
    time: '3-Hour Private Slot',
    venue: 'Cosy Lounge / Crown Screen',
    desc: 'Host private reunions, family gatherings, social get-togethers, or watch parties in a premium and cozy environment with custom buffet catering options.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    price: '$110',
  },
  {
    id: 5,
    name: 'Anniversary Candlelight Movie',
    category: 'Romance',
    date: 'Select Any Date',
    time: '3-Hour Private Slot',
    venue: 'Rose Screen (Deluxe Couple Suite)',
    desc: 'A romantic private screening setup featuring candle decorations, luxury recliners, mocktails, a customized anniversary cake, and a personal video display.',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
    price: '$130',
  },
  {
    id: 6,
    name: 'Corporate Presenting & Meetups',
    category: 'Corporate',
    date: 'Select Any Date',
    time: '3-Hour Private Slot',
    venue: 'Crown Screen (Party Hall - up to 20 Guests)',
    desc: 'Host your company seminar, client pitches, product launches, or private team screenings on our premium projector displays with high-fidelity lapel microphones.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    price: '$180',
  },
];

export default function Events({ onBookEvent, preview, onViewMore }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Celebrations', 'Romance', 'Get Together', 'Corporate'];

  const filteredEvents = activeFilter === 'All'
    ? eventsData
    : eventsData.filter(event => event.category === activeFilter);

  const handleBookClick = (eventName) => {
    onBookEvent(eventName);
  };

  return (
    <section id="events" className="relative py-24 bg-theatre-dark/95 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-theatre-grey/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-theatre-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs mb-4 block">
            Private Screenings & Rentals
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Exclusive Packages <br className="hidden sm:inline" />
            <span className="text-theatre-grey">Crafted Just for You</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full mb-8" />
          <p className="text-gray-400 text-base sm:text-lg font-sans font-light">
            Select your preferred rental type and book your private movie theatre hall slot today.
          </p>
        </div>

        {/* Filters bar */}
        {!preview && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 border ${
                  activeFilter === filter
                    ? 'bg-theatre-gold text-theatre-grey-deep border-theatre-gold shadow-lg shadow-theatre-gold/15 scale-105'
                    : 'bg-theatre-grey/10 text-gray-300 border-white/5 hover:border-theatre-grey/30 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {/* Events Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {(preview ? eventsData.slice(0, 3) : filteredEvents).map((event) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={event.id}
                className="bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl overflow-hidden border border-theatre-gold/45 hover:border-theatre-gold/80 flex flex-col h-full group transition-all duration-300 hover:shadow-xl hover:shadow-theatre-gold/5"
              >
                {/* Event Image & Tag */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-theatre-dark to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4 z-20 bg-theatre-grey/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-theatre-grey/30 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-md">
                    <Tag className="w-3.5 h-3.5 text-theatre-gold" />
                    <span>{event.category}</span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-4 right-4 z-20 bg-theatre-gold text-theatre-grey-deep px-3 py-1.5 rounded-xl font-bold font-sans text-sm shadow-md">
                    {event.price}
                  </div>
                </div>

                {/* Event Details Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-theatre-gold transition-colors duration-300 leading-tight">
                    {event.name}
                  </h3>
                  
                  <p className="text-sm text-gray-400 leading-relaxed font-sans font-light line-clamp-3">
                    {event.desc}
                  </p>

                  <div className="w-full h-px bg-white/5" />

                  {/* Info Strips */}
                  <div className="space-y-2.5 text-sm text-gray-300">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4.5 h-4.5 text-theatre-gold/80" />
                      <span className="font-sans font-light text-xs sm:text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4.5 h-4.5 text-theatre-gold/80" />
                      <span className="font-sans font-light text-xs sm:text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4.5 h-4.5 text-theatre-gold/80" />
                      <span className="font-sans font-light text-xs sm:text-sm">{event.venue}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 mt-auto">
                    <button
                      onClick={() => handleBookClick(event.name)}
                      className="w-full bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep px-5 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:shadow-theatre-gold/20 flex items-center justify-center space-x-2 transition-all duration-300 group-hover:scale-[1.02] cursor-pointer"
                    >
                      <span>Book Private Slot</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {preview && (
          <div className="text-center mt-16">
            <button
              onClick={onViewMore}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep font-bold px-8 py-4 rounded-full shadow-lg shadow-theatre-gold/15 hover:shadow-theatre-gold/25 hover:scale-105 transition-all duration-300 text-sm cursor-pointer"
            >
              <span>View All Packages</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
