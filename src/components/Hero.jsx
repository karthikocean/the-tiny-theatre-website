import React from "react";
import { motion } from "framer-motion";
import heroBg from "../assets/images/ChatGPT Image Jul 2, 2026, 12_39_46 PM.png";
import styles from "../styles/Hero.module.css";

// Static hero content
const tagline = "PRIVATE CINEMA EXPERIENCE";
const title = "Luxury Private Theatre";
const highlight = "Private Theatre";
const subtitle = "Experiences";
const description = "Indulge in a luxurious private cinema where every detail is crafted for an unforgettable moment.";

const transition = { duration: 0.6, ease: "easeInOut" };

const Hero = () => (
  <section id="hero" className={styles.heroSection}>
    {/* Background image with subtle zoom animation */}
    <motion.div
      className={styles.heroBackground}
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1, transition }}
      exit={{ opacity: 0, scale: 0.95, transition }}
    >
      <img src={heroBg} alt="Luxury Private Theatre" className={styles.heroImage} />
    </motion.div>

    {/* Gradient overlay */}
    <div className={styles.heroOverlay} />

    {/* Centered premium content */}
    <div className={styles.heroContent}>
      <div className={styles.heroTagline}>{tagline}</div>
      <div className={styles.heroDivider} />
      <h1 className={styles.heroHeading}>
        {title}<br />
        <span className={styles.heroAccent}>{highlight}</span>
      </h1>
      <h2 className={styles.heroSubtitle}>{subtitle}</h2>
      <p className={styles.heroDescription}>{description}</p>
      <div className={styles.heroButtons}>
        <motion.button whileHover={{ y: -3 }} className={styles.heroPrimaryBtn}>
          Book Now
        </motion.button>
        <motion.button whileHover={{ y: -3 }} className={styles.heroSecondaryBtn}>
          Contact Us
        </motion.button>
      </div>
    </div>
  </section>
);

export default Hero;
