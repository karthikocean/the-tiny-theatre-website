import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiSliders, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import styles from '../styles/BookingTimeline.module.css';

const steps = [
  {
    icon: FiCalendar,
    title: "Choose Your Date",
    desc: "Select your preferred date and screening time."
  },
  {
    icon: FiSliders,
    title: "Customize Experience",
    desc: "Choose decorations, food, lighting and seating."
  },
  {
    icon: FiCreditCard,
    title: "Confirm Booking",
    desc: "Complete payment and receive instant confirmation."
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
};

const BookingTimeline = () => {
  return (
    <section id="booking-timeline" className={styles.section}>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <motion.p
          className={`${styles.tagline} mb-4`}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          BOOKING PROCESS
        </motion.p>

        <motion.h2
          className={`${styles.heading} mb-6`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Book Your <span className={styles.highlight}>Private Theatre</span> In Just 3 Simple Steps
        </motion.h2>

        <motion.p
          className={`${styles.description} mb-16 lg:mb-20`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Experience cinematic luxury tailored just for you. Follow our seamless 3-step process to secure your private screening and design an unforgettable event.
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-center justify-center gap-8 lg:gap-12 w-full relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Glowing connecting line behind the cards */}
          <motion.div
            className={styles.connectorLine}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className={styles.stepCard}
              variants={cardVariants}
            >
              <div className={styles.iconContainer}>
                <step.icon size={26} />
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium CTA Button */}
        <div className="flex justify-center mt-16 lg:mt-20">
          <motion.button
            className={styles.ctaButton}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Book Your Private Screening
            <FiArrowRight className={styles.ctaIcon} />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default BookingTimeline;
