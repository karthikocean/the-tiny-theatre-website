import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/PrivateScreens.module.css';

const PrivateScreens = () => {
  return (
    <section id="private-screens" className={styles.section}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7 } }}
        viewport={{ once: true }}
      >
        {/* Image placeholder – large rounded background */}
        <div className={styles.imagePlaceholder} />
        {/* Floating content card */}
        <motion.div
          className={styles.infoCard}
          whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}
        >
          <h2 className={styles.title}>Private Screens</h2>
          <p className={styles.text}>Your own cinematic sanctuary, fully customizable for any occasion.</p>
          <ul className={styles.features}>
            <li>Tailored lighting & sound</li>
            <li>Premium seating arrangements</li>
            <li>Gourmet catering options</li>
            <li>Dedicated concierge service</li>
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PrivateScreens;
