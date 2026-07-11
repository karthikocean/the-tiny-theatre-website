import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PerfectFor from './components/PerfectFor';
import WhyChooseUs from './components/WhyChooseUs';
import BookingProcess from './components/BookingProcess';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import BookNow from './components/BookNow';
import ContactUs from './components/ContactUs';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import CancellationPolicy from './components/CancellationPolicy';
import HouseRules from './components/HouseRules';
import Footer from './components/Footer';
import CouponPage from './components/CouponPage';
import { ArrowUp, Ticket } from 'lucide-react';
import logoImg from './assets/logo.png';

function AppContent() {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // preloader curtain timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2300);
    return () => clearTimeout(timer);
  }, []);

  // scroll listener for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger scroll to top on path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleBookEvent = (eventName) => {
    setSelectedEvent(eventName);
    navigate('/contact');
  };

  const handleClearSelectedEvent = () => {
    setSelectedEvent('');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="bg-theatre-dark text-white font-sans overflow-x-hidden min-h-screen relative selection:bg-theatre-gold selection:text-theatre-grey-deep">
      
      {/* Curtain Preloader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, delay: 2.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          >
            {/* Left Curtain */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '-100%' }}
              transition={{ duration: 1.0, delay: 1.2, ease: [0.77, 0, 0.175, 1] }}
              className="absolute top-0 bottom-0 left-0 w-1/2 bg-theatre-grey-deep flex justify-end items-center"
              style={{
                backgroundImage: 'radial-gradient(circle at 100% 50%, rgba(244, 196, 48, 0.08) 0%, transparent 60%)',
              }}
            />

            {/* Right Curtain */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.0, delay: 1.2, ease: [0.77, 0, 0.175, 1] }}
              className="absolute top-0 bottom-0 right-0 w-1/2 bg-theatre-grey-deep flex justify-start items-center"
              style={{
                backgroundImage: 'radial-gradient(circle at 0% 50%, rgba(244, 196, 48, 0.08) 0%, transparent 60%)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.95, 1, 1, 0.95] }}
              transition={{ duration: 1.2, times: [0, 0.25, 0.75, 1], ease: 'easeInOut' }}
              className="relative z-50 text-center px-4 flex flex-col items-center"
            >
              <img 
                src={logoImg} 
                alt="The Tiny Theatre" 
                className="h-28 sm:h-36 w-auto object-contain mx-auto" 
                // style={{ filter: 'drop-shadow(0 0 30px rgba(244, 196, 48, 0.8)) brightness(1.25) saturate(1.4) contrast(1.1)' }}
              />
              <p className="text-theatre-gold mt-4 font-serif text-sm sm:text-base tracking-[0.25em] uppercase font-bold">
                Opening Curtains...
              </p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Website Sections */}
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <WhyChooseUs preview={true} onViewMore={() => navigate('/why-choose-us')} />
              <PerfectFor />
              <BookingProcess preview={true} onViewMore={() => navigate('/booking-process')} />
              <Gallery preview={true} onViewMore={() => navigate('/gallery')} />
              <Testimonials />
            </>
          } />
          


          <Route path="/offers" element={
            <div className="pt-32">
              <CouponPage />
            </div>
          } />

          <Route path="/why-choose-us" element={
            <div className="pt-32">
              <WhyChooseUs preview={false} />
            </div>
          } />

          <Route path="/booking-process" element={
            <div className="pt-32">
              <BookingProcess preview={false} />
            </div>
          } />

          <Route path="/gallery" element={
            <div className="pt-32">
              <Gallery preview={false} />
            </div>
          } />

          <Route path="/terms-and-conditions" element={
            <div className="pt-32">
              <TermsAndConditions />
            </div>
          } />

          <Route path="/privacy-policy" element={
            <div className="pt-32">
              <PrivacyPolicy />
            </div>
          } />

          <Route path="/contact" element={
            <div className="pt-32">
              <ContactUs selectedEventName={selectedEvent} clearSelectedEvent={handleClearSelectedEvent} />
            </div>
          } />

          <Route path="/book-now" element={
            <div className="pt-32">
              <BookNow selectedEventName={selectedEvent} clearSelectedEvent={handleClearSelectedEvent} />
            </div>
          } />

          <Route path="/cancellation-policy" element={
            <div className="pt-32">
              <CancellationPolicy />
            </div>
          } />

          <Route path="/house-rules" element={
            <div className="pt-32">
              <HouseRules />
            </div>
          } />
        </Routes>
      </main>

      <Footer />

      {/* Floating Arrow Go to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-4 bg-theatre-gold hover:bg-theatre-gold-light text-theatre-grey-deep rounded-full shadow-lg shadow-theatre-gold/20 hover:scale-110 transition-all duration-300 border border-theatre-gold/10 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer />
    </Router>
  );
}
