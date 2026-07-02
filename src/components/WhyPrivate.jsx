// src/components/WhyPrivate.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../styles/WhyPrivate.module.css';
const whyImg = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'; // placeholder

const features = [
  { title: '100% Privacy', description: 'Your exclusive space.' },
  { title: 'Birthday Celebrations', description: 'Make it unforgettable.' },
  { title: 'Anniversary Surprise', description: 'Romantic setup.' },
  { title: 'Family Entertainment', description: 'Fun for all ages.' },
  { title: 'Couple Experience', description: 'Intimate moments.' },
  { title: 'Custom Decoration', description: 'Tailor‑made ambience.' },
];

function WhyPrivate() {
  return (
    <section className="py-20 bg-sectionBg" id="why">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center">
        <motion.img
          src={whyImg}
          alt="Why private theatre"
          className="rounded-xl shadow-lg w-full lg:w-1/2 mb-8 lg:mb-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="lg:ml-12"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-heading text-white mb-6">Why Choose a Private Theatre?</h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map((item) => (
              <div key={item.title} className="p-4 bg-cardBg bg-opacity-60 backdrop-blur-sm rounded-lg shadow hover:scale-105 transition-transform">
                <h3 className="text-primary font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-secondaryText">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default WhyPrivate;
