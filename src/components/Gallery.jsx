import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Star, Quote, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { getGallery } from '../Api/galleryapi';
import { getImageUrl } from '../Api/api';

const staticGalleryItems = [
  {
    id: 1,
    title: 'Romantic Proposal Setup',
    category: 'Screen A',
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
    testimonial: 'I booked the Rose Screen for my proposal and the team did a flawless job with the balloon letters and candle pathway. She said YES! Best private theater service ever.',
    reviewer: 'Sarah Jenkins',
    role: 'Romantic Partner',
    rating: 5,
  },
  {
    id: 2,
    title: 'Custom Birthday Decor',
    category: 'Celebrations',
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    testimonial: 'Awesome birthday surprise! The balloon styling was gorgeous, sound system was super loud, and the private theater made us feel like movie stars. Recliners are extremely soft.',
    reviewer: 'Elena Rostova',
    role: 'Birthday Celebrant',
    rating: 5,
  },
  {
    id: 3,
    title: 'Dolby Atmos Sound Setup',
    category: 'Screen B',
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    testimonial: 'The 4K projection quality and the room acoustics were spectacular. Renting out the whole screen was the best movie experience we have had in years. Highly recommended.',
    reviewer: 'Marcus G.',
    role: 'Film Club Host',
    rating: 5,
  },
  {
    id: 4,
    title: 'Private Get-Together',
    category: 'Screen A',
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    testimonial: 'Hosting our get-together at The Tiny Theatre was a spectacular experience! The luxury recliners, massive screen, and warm ambience made our family gathering absolutely unforgettable.',
    reviewer: 'David K.',
    role: 'Family Event Organizer',
    rating: 5,
  },
  {
    id: 5,
    title: 'Corporate Presentation Slot',
    category: 'Others',
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    testimonial: 'Very professional screening hall. We used it for our product launch video presentations, and the sound isolation and projection contrast were absolutely top-notch.',
    reviewer: 'Clara S.',
    role: 'Tech Startup Founder',
    rating: 5,
  },
  {
    id: 6,
    title: 'Twilight Outdoor Screen',
    category: 'Celebrations',
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
    testimonial: 'Booked the twilight outdoor cinema deck for my daughter\'s sweet sixteen. Popcorn machine, wireless headsets... it was absolute magic under the stars!',
    reviewer: 'Liam & Sophia',
    role: 'Happy Parents',
    rating: 5,
  },
  {
    id: 7,
    title: 'Screen A Cinematic Experience',
    category: 'Screen A',
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-audience-in-a-cinema-hall-44754-large.mp4',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    testimonial: 'The cinema visual setup in Screen A is breathtaking. We watched our favorite movie and the projection and sound was phenomenal.',
    reviewer: 'Aniket S.',
    role: 'Movie Lover',
    rating: 5,
  },
  {
    id: 8,
    title: 'Screen B Premium Sound Test',
    category: 'Screen B',
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clapperboard-in-front-of-a-cinema-screen-41774-large.mp4',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    testimonial: 'Screen B acoustical testing felt better than major multiplex halls. Bass response is so punchy!',
    reviewer: 'Rohan M.',
    role: 'Audiophile',
    rating: 5,
  },
  {
    id: 9,
    title: 'Screen A Cinematic Film Projector',
    category: 'Screen A',
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cinema-projector-playing-a-film-41773-large.mp4',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    testimonial: 'Loved watch the old-style reels projector rolling inside Screen A. Magical!',
    reviewer: 'Devendra P.',
    role: 'Historian',
    rating: 5,
  },
  {
    id: 10,
    title: 'Screen B Popcorn Moments',
    category: 'Screen B',
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-popcorn-falling-on-a-table-41775-large.mp4',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80',
    testimonial: 'Screen B popcorn machine serves amazing fresh hot butter popcorn. Total vibe!',
    reviewer: 'Shalini K.',
    role: 'Snack Critic',
    rating: 5,
  }
];

export default function Gallery({ preview, onViewMore }) {
  const [galleryItems, setGalleryItems] = useState(staticGalleryItems);
  const [activeFilter, setActiveFilter] = useState('Screen A');
  const [activeSubFilter, setActiveSubFilter] = useState('photos'); // 'photos' or 'videos'
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [categories, setCategories] = useState(['Screen A', 'Screen B', 'Celebrations', 'Others']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getGallery();
        if (res && res.status && res.response && res.response.data) {
          const apiData = res.response.data;
          
          const items = [];
          const catSet = new Set();
          
          apiData.forEach((doc) => {
            const catName = doc.category?.name || 'Others';
            catSet.add(catName);
            
            const firstPhotoUrl = doc.photos && doc.photos.length > 0 ? getImageUrl(doc.photos[0]) : '';
            
            // Add photos
            if (doc.photos) {
              doc.photos.forEach((photo, idx) => {
                items.push({
                  id: `${doc._id}-photo-${idx}`,
                  title: `${catName} Photo ${idx + 1}`,
                  category: catName,
                  type: 'photo',
                  image: getImageUrl(photo),
                });
              });
            }
            
            // Add videos
            if (doc.videos) {
              doc.videos.forEach((video, idx) => {
                items.push({
                  id: `${doc._id}-video-${idx}`,
                  title: `${catName} Video ${idx + 1}`,
                  category: catName,
                  type: 'video',
                  videoUrl: getImageUrl(video),
                  image: firstPhotoUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
                });
              });
            }
          });
          
          if (items.length > 0) {
            setGalleryItems(items);
            const uniqueCategories = Array.from(catSet);
            setCategories(uniqueCategories.length > 0 ? uniqueCategories : ['Screen A', 'Screen B', 'Celebrations', 'Others']);
            if (uniqueCategories.length > 0) {
              setActiveFilter(uniqueCategories[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGallery();
  }, []);

  // Check if selected category has both photos and videos dynamically
  const hasVideos = galleryItems.some(item => item.category === activeFilter && item.type === 'video');
  const hasPhotos = galleryItems.some(item => item.category === activeFilter && item.type === 'photo');
  const showSubFilter = hasVideos && hasPhotos;

  // Reset subfilter to photos when switching category tab
  const handleFilterChange = (cat) => {
    setActiveFilter(cat);
    setActiveSubFilter('photos');
  };

  const filteredItems = galleryItems.filter(item => {
    // Match main category
    if (item.category !== activeFilter) return false;
    
    // If category has both photos and videos, match sub-filter (photos/videos)
    if (showSubFilter) {
      const targetType = activeSubFilter === 'photos' ? 'photo' : 'video';
      return item.type === targetType;
    }
    
    return true;
  });

  const itemsToDisplay = preview ? galleryItems.slice(0, 3) : filteredItems;

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? itemsToDisplay.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === itemsToDisplay.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="relative py-12 bg-theatre-dark overflow-hidden">
      {/* Visual background details */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-theatre-grey/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs mb-4 block">
            Review Gallery
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            Magic Captured, <br className="hidden sm:inline" />
            <span className="text-theatre-grey">Reviews Witnessed</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full mb-8" />
          <p className="text-gray-400 text-sm sm:text-base font-sans font-light">
            Browse our photo and video collections and read the real experiences left by our guests who celebrated their special events with us.
          </p>
        </div>

        {/* Filters bar */}
        {!preview && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border ${
                  activeFilter === cat
                    ? 'bg-theatre-grey text-white border-theatre-grey shadow-lg shadow-theatre-grey/15 scale-105'
                    : 'bg-white/5 text-gray-300 border-white/5 hover:border-theatre-grey/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Sub-filters bar */}
        {!preview && showSubFilter && (
          <div className="flex flex-col items-center mt-10 mb-16">
            <span className="text-[9px] uppercase tracking-[0.25em] text-gray-500 font-bold mb-3 font-sans block">
              Filter Media Type
            </span>
            <div className="relative p-1 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center w-64 max-w-full">
              <button
                onClick={() => setActiveSubFilter('photos')}
                className={`relative z-10 flex-1 py-2.5 text-center text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 rounded-xl cursor-pointer ${
                  activeSubFilter === 'photos'
                    ? 'text-theatre-grey-deep bg-theatre-gold shadow-lg shadow-theatre-gold/15'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Photos
              </button>
              <button
                onClick={() => setActiveSubFilter('videos')}
                className={`relative z-10 flex-1 py-2.5 text-center text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 rounded-xl cursor-pointer ${
                  activeSubFilter === 'videos'
                    ? 'text-theatre-grey-deep bg-theatre-gold shadow-lg shadow-theatre-gold/15'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Videos
              </button>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itemsToDisplay.map((item, index) => (
            <motion.div
              layout
              key={item.id}
              onClick={() => setSelectedImageIndex(index)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer border border-theatre-gold/45 hover:border-theatre-gold/80 shadow-md hover:shadow-theatre-grey-deep/20 transition-all duration-500 h-96"
            >
              {/* Video Indicator Badge */}
              {item.type === 'video' && (
                <div className="absolute top-4 right-4 bg-theatre-gold text-theatre-grey-deep px-3 py-1 rounded-full flex items-center space-x-1.5 z-10 text-[9px] font-sans font-extrabold uppercase tracking-wider shadow-md">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Video</span>
                </div>
              )}

              {/* Main Visual Image - Fully Vibrant */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Elegant Hover Overlay */}
              <div className="absolute inset-0 bg-theatre-dark/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-3 z-20">
                <div className="p-3 bg-theatre-gold text-theatre-grey-deep rounded-full shadow-lg shadow-theatre-gold/25 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  {item.type === 'video' ? (
                    <Play className="w-5 h-5 fill-theatre-grey-deep text-theatre-grey-deep" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </div>
                <span className="text-white text-xs font-semibold tracking-wider uppercase font-sans">
                  {item.type === 'video' ? 'Play Video' : 'Zoom Image'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {preview && (
          <div className="text-center mt-16">
            <button
              onClick={onViewMore}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep font-bold px-8 py-4 rounded-full shadow-lg shadow-theatre-gold/15 hover:shadow-theatre-gold/25 hover:scale-105 transition-all duration-300 text-sm cursor-pointer"
            >
              <span>View Full Gallery</span>
            </button>
          </div>
        )}

        {createPortal(
          <AnimatePresence>
            {selectedImageIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setSelectedImageIndex(null)}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="absolute top-6 right-6 text-white/80 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-[210] cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Centered Media Container */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                  className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {itemsToDisplay[selectedImageIndex].type === 'video' ? (
                    <video
                      src={itemsToDisplay[selectedImageIndex].videoUrl}
                      controls
                      autoPlay
                      className="max-w-full max-h-[80vh] rounded-2xl border border-white/10 shadow-2xl"
                    />
                  ) : (
                    <img
                      src={itemsToDisplay[selectedImageIndex].image}
                      alt={itemsToDisplay[selectedImageIndex].title}
                      className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
                    />
                  )}
                  
                  {/* Left navigation arrow */}
                  <button
                    onClick={handlePrev}
                    className="absolute -left-4 sm:-left-16 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-theatre-gold border border-white/10 hover:border-theatre-gold text-white hover:text-theatre-grey-deep transition-all duration-300 shadow-lg hover:scale-110 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Right navigation arrow */}
                  <button
                    onClick={handleNext}
                    className="absolute -right-4 sm:-right-16 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-theatre-gold border border-white/10 hover:border-theatre-gold text-white hover:text-theatre-grey-deep transition-all duration-300 shadow-lg hover:scale-110 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </section>
  );
}
