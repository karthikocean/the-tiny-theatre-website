import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactUs() {
  const [activeCard, setActiveCard] = React.useState(null);

  return (
    <section id="contact-us" className="relative py-10 sm:py-16 bg-theatre-dark/95 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-theatre-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-[85rem] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs mb-4 block">
            Contact Us
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-theatre-gold via-theatre-gold-light to-theatre-gold mb-6 leading-tight">
            Where to Find Us
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full mb-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onClick={() => setActiveCard(activeCard === 0 ? null : 0)}
            className={`bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl p-8 border shadow-xl hover:border-theatre-gold/25 transition-all duration-300 flex flex-col justify-center items-center text-center cursor-pointer select-none min-h-[260px] ${
              activeCard === 0
                ? 'border-theatre-gold/60 shadow-md shadow-theatre-gold/10 scale-[1.01]'
                : 'border-white/5'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-theatre-gold/10 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-theatre-gold" />
            </div>
            <div className="w-8 h-px bg-theatre-gold/30 mb-4" />
            <h4 className="text-white font-sans text-lg font-bold tracking-wide mb-3">Corporate Office</h4>
            <p className="text-gray-400 font-sans font-light text-sm leading-relaxed">
              UMA COMPLEX<br />
              PLOT NO. 14, Professors Colony, I.A.F. Road,<br />
              Tambaram East, Chennai,<br />
              Tamil Nadu - 600 059.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => setActiveCard(activeCard === 1 ? null : 1)}
            className={`bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl p-8 border shadow-xl hover:border-theatre-gold/25 transition-all duration-300 flex flex-col justify-center items-center text-center cursor-pointer select-none min-h-[260px] ${
              activeCard === 1
                ? 'border-theatre-gold/60 shadow-md shadow-theatre-gold/10 scale-[1.01]'
                : 'border-white/5'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-theatre-gold/10 flex items-center justify-center mb-6">
              <Phone className="w-6 h-6 text-theatre-gold" />
            </div>
            <div className="w-8 h-px bg-theatre-gold/30 mb-4" />
            <h4 className="text-white font-sans text-lg font-bold tracking-wide mb-3">Call &amp; WhatsApp Support</h4>
            <p className="text-gray-400 font-sans font-light text-sm leading-relaxed">
              <a href="tel:+917338848840" className="hover:text-theatre-gold transition-colors duration-300 block">
                +91 73388 48840
              </a>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => setActiveCard(activeCard === 2 ? null : 2)}
            className={`bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl p-8 border shadow-xl hover:border-theatre-gold/25 transition-all duration-300 flex flex-col justify-center items-center text-center cursor-pointer select-none min-h-[260px] ${
              activeCard === 2
                ? 'border-theatre-gold/60 shadow-md shadow-theatre-gold/10 scale-[1.01]'
                : 'border-white/5'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-theatre-gold/10 flex items-center justify-center mb-6">
              <Mail className="w-6 h-6 text-theatre-gold" />
            </div>
            <div className="w-8 h-px bg-theatre-gold/30 mb-4" />
            <h4 className="text-white font-sans text-lg font-bold tracking-wide mb-3">Email Inquiry</h4>
            <p className="text-gray-400 font-sans font-light text-sm leading-relaxed space-y-1">
              <a href="mailto:bookings@tinytheatre.com" className="hover:text-theatre-gold transition-colors duration-300 block">
                bookings@tinytheatre.com
              </a>
            </p>
          </motion.div>

        </div>

        {/* Location Map */}
        <div className="text-center mb-10">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs mb-4 block">
            Location
          </span>
          <div className="w-16 h-0.5 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full mx-auto mb-10" />
        </div>

        <div className="bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl p-3 border border-theatre-gold/45 shadow-xl overflow-hidden" style={{ minHeight: '450px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.889493694166!2d80.12429867454573!3d12.914823416121624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525f0072aa223d%3A0x864d12b68c18b61!2sUMA%20COMPLEX!5e0!3m2!1sen!2sin!4v1783315027393!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '430px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="rounded-2xl"
          />
        </div>

      </div>
    </section>
  );
}
