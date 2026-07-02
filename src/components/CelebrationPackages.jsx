import React from "react";
import { FaBirthdayCake, FaGlassCheers, FaHeart } from "react-icons/fa";
import birthdayImage from "../assets/images/birthdaycelebration.png";
import anniversaryImage from "../assets/images/anniversarycelebration.png";
import proposalImage from "../assets/images/proposalsetup.png";
import styles from "../styles/CelebrationPackages.module.css";

const packages = [
    {
        icon: <FaBirthdayCake />,
        title: "Birthday Celebration",
        description:
            "Celebrate your special day in a luxurious private theatre with custom decorations and unforgettable moments.",
        image: birthdayImage,
    },
    {
        icon: <FaGlassCheers />,
        title: "Anniversary Celebration",
        description:
            "Create beautiful memories together with a romantic private cinema experience.",
        image: anniversaryImage,
    },
    {
        icon: <FaHeart />,
        title: "Proposal Setup",
        description:
            "Make your proposal magical with premium décor, lighting and your favourite movie.",
        image: proposalImage,
    },
];

const CelebrationPackages = () => {
    return (
        <section id="celebration-packages" className="w-full bg-[#0B0B0B] py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="uppercase tracking-[4px] text-[#FFC512] text-sm font-semibold">
                        Luxury Enhancements
                    </p>

                    <div className={styles.divider}></div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">
                        Elevate Your Celebration
                    </h2>

                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        Choose from our curated celebration packages to make every
                        experience unforgettable.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {packages.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.card} bg-[#151515] rounded-3xl overflow-hidden border border-[#2A2A2A] hover:border-[#008C6A] transition-all duration-300 hover:-translate-y-2`}
                        >
                            <div className="h-64 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className={`${styles.cardContent} p-7`}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconWrapper}>
                                        {item.icon}
                                    </div>
                                    <h3 className={styles.packageTitle}>
                                        {item.title}
                                    </h3>
                                </div>

                                <p className={styles.packageDescription}>
                                    {item.description}
                                </p>

                                <button className={`${styles.packageButton} bg-[#008C6A] hover:bg-[#00A57E] text-white py-3 rounded-full font-semibold transition duration-300`}>
                                    Select Package
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CelebrationPackages;