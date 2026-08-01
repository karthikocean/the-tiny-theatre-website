import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTerms } from '../Api/Termsapi';
export default function HouseRules() {
  const [houseRulesData, setHouseRulesData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchHouseRules = async () => {
      try {
        const res = await getTerms({ title: 'house' });
        if (res.status && res.response?.data?.length > 0) {
          setHouseRulesData(res.response.data[0]);
        } else {
          setHouseRulesData(null);
        }
      } catch (err) {
        console.error("Error fetching house rules:", err);
        setHouseRulesData(null);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchHouseRules();
  }, []);
  const sections = [
    {
      id: 1,
      title: "Before Your Visit",
      content: [
        "Arrive 10–15 minutes before your scheduled booking.",
        "Carry your booking confirmation.",
        "Inform us in advance of any special celebration or decoration requests."
      ]
    },
    {
      id: 2,
      title: "During Your Visit",
      content: [
        "Treat the theatre, furniture, decorations, and equipment with care.",
        "Follow the guidance of our staff at all times.",
        "Keep the theatre clean and use the bins provided.",
        "Supervise children throughout the visit.",
        "Maintain a respectful environment for staff and other guests."
      ]
    },
    {
      id: 3,
      title: "Food & Beverages",
      content: [
        "Food and beverages should be consumed responsibly.",
        "Outside food or decorations are permitted only with prior approval, if applicable."
      ]
    },
    {
      id: 4,
      title: "Prohibited Activities",
      content: [
        "The following are not permitted:",
        "Smoking or vaping inside the premises.",
        "Illegal drugs or unlawful activities.",
        "Damage to theatre property.",
        "Dangerous or disruptive behaviour.",
        "Bringing hazardous materials or weapons onto the premises."
      ]
    },
    {
      id: 5,
      title: "Personal Belongings",
      content: [
        "Guests are responsible for their personal belongings. The Tiny Theatre is not responsible for lost, stolen, or unattended items."
      ]
    },
    {
      id: 6,
      title: "Content Played",
      content: [
        "Guests are responsible for ensuring that any movies, music, or other media they play or stream are used lawfully and in accordance with the terms of the relevant streaming or content service."
      ]
    },
    {
      id: 7,
      title: "Safety",
      content: [
        "Please familiarise yourself with emergency exits and follow staff instructions during any emergency."
      ]
    }
  ];

  const displayIntro = houseRulesData?.introText || (!isLoaded ? "Welcome to The Tiny Theatre. To ensure a safe, comfortable, and enjoyable experience for everyone, please follow these house rules." : null);

  const displaySections = (houseRulesData?.sections && houseRulesData.sections.length > 0)
    ? houseRulesData.sections.map((section, idx) => ({
      id: idx + 1,
      title: section.title,
      content: section.points || []
    }))
    : (!isLoaded && !houseRulesData?.content ? sections : []);

  const displayLastUpdated = houseRulesData?.updatedAt
    ? `Last Updated: ${new Date(houseRulesData.updatedAt).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`
    : houseRulesData?.createdAt
      ? `Last Updated: ${new Date(houseRulesData.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`
      : "Last Updated: July 11, 2026";

  return (
    <section className="relative py-24 bg-theatre-dark min-h-screen overflow-hidden">
      {/* Premium ambient glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-theatre-grey/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-theatre-gold/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">


        {/* Title */}
        <h1 className="text-center font-serif text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Theatre <span className="text-theatre-gold">House Rules</span>
        </h1>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-theatre-gold/60" />
          <span className="text-theatre-gold text-sm font-serif">❦</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-theatre-gold/60" />
        </div>

        {/* Last Updated */}
        <p className="text-center text-gray-400 text-xs tracking-wider uppercase mb-16">
          {displayLastUpdated}
        </p>

        {isLoaded && !houseRulesData ? (
          <div className="bg-theatre-grey-deep/30 border border-theatre-gold/25 rounded-2xl p-12 text-center text-gray-400 font-sans text-base">
            House Rules are currently unavailable.
          </div>
        ) : (
          <>
            {/* Introduction */}
            {displayIntro && (
              <div className="bg-theatre-grey-deep/30 border border-theatre-gold/25 rounded-2xl p-6 sm:p-8 mb-12 text-gray-300 font-sans font-light leading-relaxed text-center sm:text-left">
                {displayIntro}
              </div>
            )}

            {/* Plain Text Body (When isStructured is false or no sections provided) */}
            {houseRulesData?.content && (!houseRulesData?.sections || houseRulesData.sections.length === 0) ? (
              <div className="bg-theatre-grey-deep/30 border border-theatre-gold/25 rounded-2xl p-6 sm:p-10 text-gray-300 font-sans font-light leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {houseRulesData.content}
              </div>
            ) : (
              /* Clause List */
              <div className="space-y-12">
                {displaySections.map((section, idx) => (
                  <motion.div
                    key={section.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="border-b border-white/5 pb-8"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Section Number Bubble */}
                      <div className="w-10 h-10 rounded-xl bg-theatre-grey/10 border border-theatre-gold/40 flex items-center justify-center text-theatre-gold font-serif font-bold text-base flex-shrink-0 mt-0.5 shadow-md">
                        {section.id || idx + 1}
                      </div>

                      <div className="space-y-4 flex-grow">
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                          {section.title}
                        </h3>

                        {section.content.length === 1 ? (
                          <p className="text-gray-300 font-sans font-light leading-relaxed text-base sm:text-lg">
                            {section.content[0]}
                          </p>
                        ) : (
                          <ul className="space-y-3.5 pl-1">
                            {section.content.map((point, pIdx) => {
                              const isSubHeader = point.endsWith(':');
                              return (
                                <li
                                  key={pIdx}
                                  className={`font-sans font-light leading-relaxed text-base sm:text-lg ${isSubHeader
                                    ? 'text-white font-normal mt-2 list-none'
                                    : 'text-gray-300 pl-4 list-disc marker:text-theatre-gold'
                                    }`}
                                >
                                  {point}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* End Note */}
        <div className="mt-20 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-theatre-grey/10 border border-theatre-gold/50 rounded-full flex items-center justify-center shadow-lg mb-4">
            <Shield className="w-5 h-5 text-theatre-gold" />
          </div>
          <p className="text-gray-300 text-sm font-sans font-light leading-relaxed max-w-md">
            Thank you for helping us maintain a clean, safe, and welcoming environment.<br />
            <strong>MOVIES. MUNCHIES. MEMORIES.</strong>
          </p>
        </div>

      </div>
    </section>
  );
}
