import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Ticket, Gift, Sparkles, Flame, Clock, Calendar } from 'lucide-react';

export default function CouponPage() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);

  const coupons = [
    {
      code: "FIRSTSHOW10",
      discount: "10% OFF",
      title: "First Screening Discount",
      desc: "Get flat 10% off on your very first private theatre screening booking.",
      expiry: "Valid till 31 Dec 2026",
      terms: "Valid on all experience packages for first-time customers.",
      badge: "Welcome Deal",
      icon: Ticket
    },
    {
      code: "CELEBRATEFREE",
      discount: "FREE CAKE",
      title: "Milestone Birthday Special",
      desc: "Get a complimentary custom theme cake and basic balloons decoration setup.",
      expiry: "Valid till 31 Dec 2026",
      terms: "Minimum booking duration of 3 hours. Proof of birthday required.",
      badge: "Celebration",
      icon: Gift
    },
    {
      code: "MIDWEEK15",
      discount: "15% OFF",
      title: "Mid-Week Cinema Madness",
      desc: "Save 15% on any private theater rentals scheduled from Monday to Thursday.",
      expiry: "Valid till 30 Nov 2026",
      terms: "Applicable on slots between 10:00 AM and 5:00 PM.",
      badge: "Weekday Saver",
      icon: Flame
    },
    {
      code: "ROMANCEDATE",
      discount: "FREE SNACKS",
      title: "Couple Date Night Combo",
      desc: "Enjoy complimentary premium salted popcorn and two soft beverages on us.",
      expiry: "Valid till 31 Dec 2026",
      terms: "Applicable exclusively on Couple's Date Night package bookings.",
      badge: "Romance Special",
      icon: Sparkles
    }
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-theatre-dark to-theatre-dark/95 overflow-hidden min-h-screen">
      {/* Premium background ambient glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-theatre-grey/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-theatre-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs sm:text-sm mb-4 block">
            Exclusive Offers & Promo Codes
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Tiny Theatre <span className="text-theatre-gold">Coupons</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full mb-8" />
          <p className="text-gray-400 text-base sm:text-lg font-sans font-light leading-relaxed">
            Claim these special discount codes and celebration add-ons to make your private cinema experience even more memorable.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {coupons.map((coupon, idx) => {
            const Icon = coupon.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-theatre-grey-deep/20 backdrop-blur-md rounded-3xl border border-theatre-gold/45 overflow-hidden flex flex-col sm:flex-row relative group hover:border-theatre-gold transition-all duration-300"
              >
                {/* Perforated ticket divider for screen sizes > sm */}
                <div className="hidden sm:block absolute left-[30%] top-0 bottom-0 border-l-2 border-dashed border-theatre-gold/30 z-10" />
                <div className="hidden sm:block absolute left-[30%] -top-4 w-8 h-8 rounded-full bg-theatre-dark border border-theatre-gold/45 z-20" />
                <div className="hidden sm:block absolute left-[30%] -bottom-4 w-8 h-8 rounded-full bg-theatre-dark border border-theatre-gold/45 z-20" />

                {/* Left Side: Discount Banner */}
                <div className="sm:w-[30%] bg-gradient-to-br from-theatre-grey-deep/80 to-theatre-grey-deep/45 p-6 flex flex-col justify-center items-center text-center border-b sm:border-b-0 sm:border-r border-theatre-gold/30 relative">
                  <div className="w-12 h-12 rounded-2xl bg-theatre-gold/10 border border-theatre-gold/20 flex items-center justify-center text-theatre-gold mb-3 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-theatre-gold font-bold mb-1 block">
                    {coupon.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
                    {coupon.discount}
                  </h3>
                </div>

                {/* Right Side: Details & Copy Code */}
                <div className="flex-grow p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-serif font-bold text-white tracking-wide group-hover:text-theatre-gold transition-colors duration-300">
                      {coupon.title}
                    </h4>
                    <p className="text-gray-400 font-sans font-light text-sm leading-relaxed">
                      {coupon.desc}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-white/5">
                    {/* Expiry info */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5 text-theatre-gold/80" />
                        <span>{coupon.expiry}</span>
                      </div>
                      <p className="text-[10px] text-gray-600 leading-tight">
                        * {coupon.terms}
                      </p>
                    </div>

                    {/* Interactive Copy Code Area */}
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className={`flex items-center space-x-2 px-5 py-3 rounded-2xl border transition-all duration-300 font-sans text-xs font-semibold tracking-wider cursor-pointer ${
                        copiedCode === coupon.code
                          ? "bg-theatre-gold border-theatre-gold text-theatre-grey-deep"
                          : "bg-theatre-dark/60 border-theatre-gold/40 text-theatre-gold hover:border-theatre-gold hover:bg-theatre-dark"
                      }`}
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>{coupon.code}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-20">
          <button
            onClick={() => navigate('/book-now')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep font-bold px-8 py-4 rounded-full shadow-lg shadow-theatre-gold/15 hover:shadow-theatre-gold/25 hover:scale-105 transition-all duration-300 text-sm cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Apply Coupon & Book Now</span>
          </button>
        </div>

      </div>
    </section>
  );
}
