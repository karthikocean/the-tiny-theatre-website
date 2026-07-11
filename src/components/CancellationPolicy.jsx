import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function CancellationPolicy() {
  const sections = [
    {
      id: 1,
      title: "Booking Confirmation",
      content: [
        "A booking is confirmed only after the required advance payment has been received."
      ]
    },
    {
      id: 2,
      title: "Cancellation by Customer",
      content: [
        "Cancellation requests must be made through the same contact details used for the booking.",
        "Any refund, if applicable, will be processed according to the cancellation terms communicated at the time of booking."
      ]
    },
    {
      id: 3,
      title: "Rescheduling",
      content: [
        "Rescheduling requests are subject to availability.",
        "We will make reasonable efforts to accommodate your preferred new date and time."
      ]
    },
    {
      id: 4,
      title: "Cancellation by The Tiny Theatre",
      content: [
        "If we are unable to provide your booking due to unforeseen circumstances, we will offer:",
        "An alternative date or time, or",
        "A refund of the amount paid, where applicable."
      ]
    },
    {
      id: 5,
      title: "No-Show",
      content: [
        "Guests who do not arrive for their confirmed booking without prior notice may not be eligible for a refund or rescheduling."
      ]
    },
    {
      id: 6,
      title: "Refund Processing",
      content: [
        "Where a refund is approved, it will be processed using the original payment method. Processing times may vary depending on your payment provider."
      ]
    },
    {
      id: 7,
      title: "Contact",
      content: [
        "For cancellation or refund assistance, please contact our team before your scheduled booking."
      ]
    }
  ];

  return (
    <section className="relative py-24 bg-theatre-dark min-h-screen overflow-hidden">
      {/* Premium ambient glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-theatre-grey/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-theatre-gold/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Subtitle */}
        <div className="text-center mb-2">
          <span className="text-theatre-gold text-xs font-semibold tracking-[0.25em] uppercase">
            → REFUND RULES ←
          </span>
        </div>

        {/* Title */}
        <h1 className="text-center font-serif text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Cancellation & <span className="text-theatre-gold">Refund Policy</span>
        </h1>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-theatre-gold/60" />
          <span className="text-theatre-gold text-sm font-serif">❦</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-theatre-gold/60" />
        </div>

        {/* Last Updated */}
        <p className="text-center text-gray-400 text-xs tracking-wider uppercase mb-16">
          Last Updated: July 2026
        </p>

        {/* Introduction */}
        <div className="bg-theatre-grey-deep/30 border border-theatre-gold/25 rounded-2xl p-6 sm:p-8 mb-12 text-gray-300 font-sans font-light leading-relaxed text-center sm:text-left">
          Our goal is to provide flexibility while ensuring fair scheduling for all guests.
        </div>

        {/* Clause List */}
        <div className="space-y-12">
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="border-b border-white/5 pb-8"
            >
              <div className="flex items-start space-x-4">
                {/* Section Number Bubble */}
                <div className="w-10 h-10 rounded-xl bg-theatre-grey/10 border border-theatre-gold/40 flex items-center justify-center text-theatre-gold font-serif font-bold text-base flex-shrink-0 mt-0.5 shadow-md">
                  {section.id}
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
                            className={`font-sans font-light leading-relaxed text-base sm:text-lg ${
                              isSubHeader 
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

        {/* End Note */}
        <div className="mt-20 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-theatre-grey/10 border border-theatre-gold/50 rounded-full flex items-center justify-center shadow-lg mb-4">
            <Shield className="w-5 h-5 text-theatre-gold" />
          </div>
          <p className="text-gray-400 text-sm font-sans font-light leading-relaxed max-w-md">
            Thank you for reviewing our policies. If you need cancellation assistance, please get in touch with our representative.
          </p>
        </div>

      </div>
    </section>
  );
}
