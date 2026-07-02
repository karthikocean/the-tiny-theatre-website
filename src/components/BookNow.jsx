// src/components/BookNow.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../styles/BookNow.module.css';

function BookNow() {
  return (
    <section className="py-20 bg-cardBg bg-opacity-60 backdrop-blur-lg" id="book">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
        <motion.h2
          className="text-4xl font-heading text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Book Your Private Theatre
        </motion.h2>
        <motion.p
          className="text-lg text-secondaryText mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Choose your theatre, date, and time to create unforgettable memories.
        </motion.p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-4 bg-darkBg bg-opacity-70 rounded-lg shadow">
            <h3 className="text-primary font-semibold mb-2">Choose Theatre</h3>
            <p className="text-sm text-secondaryText">Select from our exclusive spaces.</p>
          </div>
          <div className="p-4 bg-darkBg bg-opacity-70 rounded-lg shadow">
            <h3 className="text-primary font-semibold mb-2">Choose Date</h3>
            <p className="text-sm text-secondaryText">Pick the perfect day.</p>
          </div>
          <div className="p-4 bg-darkBg bg-opacity-70 rounded-lg shadow">
            <h3 className="text-primary font-semibold mb-2">Choose Time</h3>
            <p className="text-sm text-secondaryText">Select your slot.</p>
          </div>
        </div>
        <button className="mt-8 btn-primary px-8 py-3">Book Now</button>
      </div>
    </section>
  );
}

export default BookNow;
