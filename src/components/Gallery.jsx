import React from "react";
import { motion } from "framer-motion";
import { FiPlus, FiArrowRight } from "react-icons/fi";
import styles from "../styles/Gallery.module.css";

import galleryImage1 from "../assets/images/galleryimage1.png";
import galleryImage2 from "../assets/images/galleryimage2.png";
import galleryImage3 from "../assets/images/galleryimage3.png";
import galleryImage4 from "../assets/images/galleryimage4.png";
import galleryImage5 from "../assets/images/galleryimage5.png";
import galleryImage6 from "../assets/images/galleryimage6.png";
import galleryImage7 from "../assets/images/galleryimage7.png";
import galleryImage8 from "../assets/images/galleryimage8.png";

const images = [
  galleryImage1,
  galleryImage2,
  galleryImage3,
  galleryImage4,
  galleryImage5,
  galleryImage6,
  galleryImage7,
  galleryImage8
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
};

const Gallery = () => {
  return (
    <section id="gallery" className={styles.gallerySection}>
      <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center">
        {/* Section Header */}
        <motion.p 
          className={`${styles.tagline} mb-4`}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          GALLERY
        </motion.p>

        <motion.h2 
          className={`${styles.heading} mb-6`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Experience Every <span className={styles.highlight}>Special Moment</span>
        </motion.h2>

        <motion.p 
          className={`${styles.description} mb-16 lg:mb-20`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Explore unforgettable celebrations, romantic proposals, birthdays and premium private theatre experiences captured inside The Tiny Theatre.
        </motion.p>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {images.map((img, idx) => (
            <motion.div 
              key={idx}
              className={styles.imageCard}
              variants={cardVariants}
            >
              <img src={img} alt={`Gallery Moment ${idx + 1}`} className={styles.cardImage} />
              <div className={styles.cardOverlay}>
                <FiPlus className={styles.overlayIcon} />
                <span className={styles.overlayText}>View Gallery</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Button */}
        <div className="flex justify-center mt-12 lg:mt-16">
          <motion.button
            className={styles.viewButton}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            View Full Gallery
            <FiArrowRight className={styles.buttonIcon} />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;