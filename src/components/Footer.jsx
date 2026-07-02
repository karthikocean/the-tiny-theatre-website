import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaArrowRight, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import styles from '../styles/Footer.module.css';

const footerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.15
    }
  }
};

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

function Footer() {
  return (
    <motion.footer
      className={styles.footer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={footerVariants}
      id="contact"
    >
      <div className={`${styles.footerContainer} container mx-auto px-6 md:px-12 py-20 pb-8`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-12 w-full">
          {/* Column 1 */}
          <motion.div className="flex flex-col gap-6" variants={columnVariants}>
            <h3 className={styles.logo}>The Tiny Theatre</h3>
            <p className={styles.description}>
              Experience unforgettable private cinema moments designed for birthdays, anniversaries, proposals and exclusive celebrations.
            </p>
            <div className="flex gap-4">
              <motion.a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} variants={socialVariants}>
                <FaInstagram size={18} />
              </motion.a>
              <motion.a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} variants={socialVariants}>
                <FaFacebookF size={16} />
              </motion.a>
              <motion.a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} variants={socialVariants}>
                <FaWhatsapp size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Column 2 */}
          <motion.div className="flex flex-col gap-6" variants={columnVariants}>
            <h4 className={styles.heading}>Quick Links</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#home" className={styles.link}>
                  <FaArrowRight className={styles.linkArrow} />
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className={styles.link}>
                  <FaArrowRight className={styles.linkArrow} />
                  About
                </a>
              </li>
              <li>
                <a href="#gallery" className={styles.link}>
                  <FaArrowRight className={styles.linkArrow} />
                  Gallery
                </a>
              </li>
              <li>
                <a href="#book" className={styles.link}>
                  <FaArrowRight className={styles.linkArrow} />
                  Book Now
                </a>
              </li>
              <li>
                <a href="#contact" className={styles.link}>
                  <FaArrowRight className={styles.linkArrow} />
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 3 */}
          <motion.div className="flex flex-col gap-6" variants={columnVariants}>
            <h4 className={styles.heading}>Legal</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#privacy" className={styles.link}>
                  <FaArrowRight className={styles.linkArrow} />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#refund" className={styles.link}>
                  <FaArrowRight className={styles.linkArrow} />
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#terms" className={styles.link}>
                  <FaArrowRight className={styles.linkArrow} />
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#booking-policy" className={styles.link}>
                  <FaArrowRight className={styles.linkArrow} />
                  Booking Policy
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 4 */}
          <motion.div className="flex flex-col gap-6" variants={columnVariants}>
            <h4 className={styles.heading}>Contact</h4>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <FaMapMarkerAlt className={`${styles.contactIcon} mt-1`} />
                <p className={styles.contactText}>
                  The Tiny Theatre<br />
                  123 Cinema Lane<br />
                  Chennai, Tamil Nadu<br />
                  India
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <FaPhoneAlt className={styles.contactIcon} />
                <a href="tel:+91XXXXXXXXXX" className={styles.contactText}>+91 9876543210</a>
              </div>
              <div className="flex gap-3 items-center">
                <FaEnvelope className={styles.contactIcon} />
                <a href="mailto:info@thetinytheatre.com" className={styles.contactText}>info@thetinytheatre.com</a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider Line */}
        <hr className={`${styles.divider} w-full mt-16 mb-8`} />

        {/* Bottom Footer Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className={styles.bottomText}>
            © 2026 The Tiny Theatre. All Rights Reserved.
          </p>
          <p className={styles.bottomText}>
            Developed by <a href="https://oceansoftware.in" target="_blank" rel="noopener noreferrer" className={styles.developerLink}>Ocean Software</a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
