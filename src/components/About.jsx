import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaCouch, FaVolumeUp, FaFilm } from "react-icons/fa";
import AboutImage from "../assets/images/aboutimg.png";
import styles from "../styles/About.module.css";

const features = [
  {
    icon: FaUsers,
    title: "Private Experience",
    desc: "Enjoy complete privacy with your loved ones.",
  },
  {
    icon: FaCouch,
    title: "Luxury Seating",
    desc: "Premium recliners for maximum comfort.",
  },
  {
    icon: FaVolumeUp,
    title: "Dolby Atmos",
    desc: "Immersive surround sound experience.",
  },
  {
    icon: FaFilm,
    title: "4K Projection",
    desc: "Crystal-clear cinema quality visuals.",
  },
];

function About() {
  return (
    <section className={styles.aboutSection} id="about">
      <div className="container mx-auto px-6 lg:px-8 xl:px-10 flex flex-col lg:flex-row items-center gap-12">

        {/* LEFT IMAGE */}
        <motion.div
          className={styles.imageWrapper}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={AboutImage}
            alt="About The Tiny Theatre"
            className={styles.image}
          />
        </motion.div>

        {/* RIGHT CONTENT */}
        <motion.div
          className={styles.contentWrapper}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className={styles.tagline}>
            ABOUT THE TINY THEATRE
          </span>

          <div className={styles.divider}></div>

          <h2 className={styles.heading}>
            More Than A <span className={styles.highlight}>Private Theatre.</span>
          </h2>

          <p className={styles.subHeading}>
            It's More Than Entertainment. It's An Experience.
          </p>

          <p className={styles.description}>
            Experience an exclusive private cinema where luxury meets comfort.
            Our premium spaces are designed for unforgettable moments—
            birthdays, anniversaries, proposals, and more.
          </p>

          <motion.div
            className={styles.cardsGrid}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={index}
                  className={styles.card}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 20,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                  }}
                >
                  <div className={styles.iconWrapper}>
                    <Icon className={styles.icon} />
                  </div>

                  <div>
                    <h3 className={styles.cardTitle}>
                      {feature.title}
                    </h3>

                    <p className={styles.cardDesc}>
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

export default About;