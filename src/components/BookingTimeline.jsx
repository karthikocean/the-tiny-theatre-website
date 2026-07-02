import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/BookingTimeline.module.css';

const BookingTimeline = () => {
  return (
    <section id="booking-timeline" className={styles.section}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7 } }}
        viewport={{ once: true }}
      >
        {/* Curved background container – handled via CSS */}
        <div className={styles.curvedBackground} />
        {/* Timeline steps */}
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Choose Your Date</h3>
            <p className={styles.stepDesc}>Select the preferred day and time for your private screening.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Customize the Experience</h3>
            <p className={styles.stepDesc}>Pick seating, lighting, catering, and special extras.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Confirm & Pay</h3>
            <p className={styles.stepDesc}>Secure your booking with our easy online payment.</p>
          </div>
        </div>
        {/* Glowing CTA button */}
        <motion.button
          className={styles.ctaButton}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,197,18,0.6)' }}
        >
          Book Your Private Screening
        </motion.button>
      </motion.div>
    </section>
  );
};

export default BookingTimeline;
