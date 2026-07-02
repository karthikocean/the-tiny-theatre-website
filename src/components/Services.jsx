// src/components/Services.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaFilm, FaBirthdayCake, FaHeart, FaBuilding, FaChild, FaRegHandshake } from 'react-icons/fa';
import '../styles/Services.module.css';

const services = [
  { icon: <FaFilm size={32} />, title: 'Private Movie Experience', desc: 'Your own cinema with top‑notch tech.' },
  { icon: <FaBirthdayCake size={32} />, title: 'Birthday Celebration', desc: 'Celebrate in style with exclusive décor.' },
  { icon: <FaHeart size={32} />, title: 'Proposal Setup', desc: 'Romantic ambience for that special moment.' },
  { icon: <FaBuilding size={32} />, title: 'Corporate Screening', desc: 'Impress clients with a premium venue.' },
  { icon: <FaChild size={32} />, title: 'Kids Party', desc: 'Safe, fun, and unforgettable.' },
  { icon: <FaRegHandshake size={32} />, title: 'Custom Decoration', desc: 'Tailored themes for any occasion.' },
];

function Services() {
  return (
    <section className="py-20 bg-darkBg" id="services">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
        <motion.h2
          className="text-4xl font-heading text-white mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Premium Services
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((svc) => (
            <motion.div
              key={svc.title}
              className="p-6 bg-cardBg bg-opacity-60 backdrop-blur-sm rounded-xl shadow hover:scale-105 transition-transform"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex justify-center mb-4 text-primary">{svc.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{svc.title}</h3>
              <p className="text-sm text-secondaryText">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
