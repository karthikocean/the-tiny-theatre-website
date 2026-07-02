import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Navbar.module.css';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.nav
      className={`${styles.navbar} fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 transition-all ${scrolled ? 'bg-[#0B0B0B] bg-opacity-70 backdrop-blur-lg' : 'bg-transparent'}`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-2xl font-heading text-[#FFC512]">The Tiny Theatre</div>
      <div className="hidden md:flex space-x-8 text-lg font-body">
        <a href="#hero" className="hover:text-[#FFC512] transition-colors">Home</a>
        <a href="#about" className="hover:text-[#FFC512] transition-colors">About</a>
        <a href="#why-choose-us" className="hover:text-[#FFC512] transition-colors">Why Choose Us</a>
        <a href="#booking-timeline" className="hover:text-[#FFC512] transition-colors">Booking Process</a>
        <a href="#celebration-packages" className="hover:text-[#FFC512] transition-colors">Events</a>
        <a href="#gallery" className="hover:text-[#FFC512] transition-colors">Gallery</a>
      </div>
      <div className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="absolute top-full left-0 w-full bg-[#111111] glass p-6 flex flex-col space-y-4 md:hidden"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
        >
          <a href="#hero" className="text-lg hover:text-[#FFC512]" onClick={toggleMenu}>
            Home
          </a>

          <a href="#about" className="text-lg hover:text-[#FFC512]" onClick={toggleMenu}>
            About
          </a>

          <a href="#why-choose-us" className="text-lg hover:text-[#FFC512]" onClick={toggleMenu}>
            Why Choose Us
          </a>

          <a href="#booking-timeline" className="text-lg hover:text-[#FFC512]" onClick={toggleMenu}>
            Booking Process
          </a>

          <a href="#celebration-packages" className="text-lg hover:text-[#FFC512]" onClick={toggleMenu}>
            Events
          </a>

          <a href="#gallery" className="text-lg hover:text-[#FFC512]" onClick={toggleMenu}>
            Gallery
          </a>
        </motion.div>
      )}
      <button className="ml-4 hidden md:inline-block bg-[#FFC512] text-[#0B0B0B] font-body font-medium px-5 py-2 rounded-full hover:scale-105 transition-transform glow-gold">
        Book Now
      </button>
    </motion.nav>
  );
};

export default Navbar;
