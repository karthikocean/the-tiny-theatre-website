import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaBirthdayCake, FaHeart, FaStar } from "react-icons/fa";
import bgImage from "../assets/images/whychoose-bg.png";
import styles from "../styles/WhyChooseUs.module.css";

const stats = [
  { icon: FaUsers, value: 2500, suffix: "+", label: "Happy Guests" },
  { icon: FaBirthdayCake, value: 500, suffix: "+", label: "Birthday Events" },
  { icon: FaHeart, value: 1000, suffix: "+", label: "Couple Celebrations" },
  { icon: FaStar, value: 4.9, suffix: "★", label: "Google Rating" },
];

function Counter({ target, suffix }) {
  const [count, setCount] = React.useState(0);
  const started = React.useRef(false);

  React.useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const duration = 2000;
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = target * progress;
      if (Number.isInteger(target)) {
        setCount(Math.floor(current));
      } else {
        setCount(parseFloat(current.toFixed(1)));
      }
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);

  return (
    <span>{Number.isInteger(target) ? count : count.toFixed(1)}{suffix}</span>
  );
}

const WhyChooseUs = () => (
  <section id="why-choose-us" className={styles.section} style={{ backgroundImage: `url(${bgImage})` }}>
    <div className={styles.overlay} />
    <div className={`${styles.content} container mx-auto flex flex-col items-center justify-center h-full px-4 text-center`}>
      <motion.p
        className={`${styles.tagline} mb-4`}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        viewport={{ once: true }}
      >
        WHY CHOOSE US
      </motion.p>

      <div className={styles.divider}></div>

      <motion.h2
        className={`${styles.heading} mb-6`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
        viewport={{ once: true }}
      >
        Why Every Celebration Deserves <span className={styles.highlight}>Luxury</span>
      </motion.h2>

      <motion.p
        className={`${styles.description} mb-12 md:mb-16`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }}
        viewport={{ once: true }}
      >
        Our private theatre blends bespoke design with state‑of‑the‑art technology, delivering an unforgettable cinematic journey for every special moment.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
        initial="hidden"
        whileInView="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
        viewport={{ once: true }}
      >
        {stats.map((item, idx) => (
          <motion.div
            key={idx}
            className={styles.statCard}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <div className={styles.statIcon}>
              <item.icon size={28} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statCounter}>
                <Counter target={item.value} suffix={item.suffix} />
              </div>
              <div className={styles.statLabel}>{item.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default WhyChooseUs;
