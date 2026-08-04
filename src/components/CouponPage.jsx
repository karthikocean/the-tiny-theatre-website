import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Ticket, Gift, Sparkles, Flame, Clock, Calendar } from 'lucide-react';
import { getActiveCoupons } from '../Api/CouponApi';
import { formatCurrency } from '../utils/formatCurrency';

export default function CouponPage() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true);
      const res = await getActiveCoupons();
      if (res.status) {
        setCoupons(res.response?.data || []);
      }
      setIsLoading(false);
    };
    fetchCoupons();
  }, []);

  const getIcon = (idx) => {
    const icons = [Ticket, Gift, Flame, Sparkles];
    return icons[idx % icons.length];
  };

  return (
    <section className="relative pt-10 pb-20 sm:py-20 bg-gradient-to-b from-theatre-dark to-theatre-dark/95 overflow-hidden min-h-screen">
      {/* Premium background ambient glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-theatre-grey/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-theatre-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 sm:pt-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs sm:text-sm mb-4 block">
            Exclusive Offers
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Tiny Theatre <span className="text-theatre-gold">Coupons</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full mb-8" />
          <p className="text-gray-400 text-base sm:text-lg font-sans font-light leading-relaxed">
            Explore our available coupons below. During the final payment, you can apply any valid coupon to receive an instant discount on your total booking amount.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {isLoading ? (
            <div className="col-span-full text-center text-white py-10">Loading available offers...</div>
          ) : coupons.length === 0 ? (
            <div className="col-span-full text-center text-white py-10">No active offers available at the moment. Please check back later!</div>
          ) : (
            coupons.map((coupon, idx) => {
              const Icon = getIcon(idx);
              const discountText = coupon.type === 'Percentage' ? `${coupon.value}% OFF` : `₹${formatCurrency(coupon.value)} OFF`;
              const expiryText = coupon.validTo 
                ? `Valid till ${new Date(coupon.validTo).toLocaleDateString('en-GB')}` 
                : 'Limited Time Offer';

              return (
                <motion.div
                  key={coupon._id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-theatre-grey-deep/20 backdrop-blur-md rounded-3xl border border-theatre-gold/45 overflow-hidden flex flex-col sm:flex-row relative group hover:border-theatre-gold transition-all duration-300"
                >
                  {/* Perforated ticket divider for screen sizes > sm */}
                  <div className="hidden sm:block absolute left-[30%] top-0 bottom-0 border-l-2 border-dashed border-theatre-gold/30 z-10 -translate-x-1/2" />
                  <div className="hidden sm:block absolute left-[30%] -top-4 w-8 h-8 rounded-full bg-theatre-dark border border-theatre-gold/45 z-20 -translate-x-1/2" />
                  <div className="hidden sm:block absolute left-[30%] -bottom-4 w-8 h-8 rounded-full bg-theatre-dark border border-theatre-gold/45 z-20 -translate-x-1/2" />

                  {/* Left Side: Discount Banner */}
                  <div className="sm:w-[30%] shrink-0 bg-gradient-to-br from-theatre-grey-deep/80 to-theatre-grey-deep/45 p-6 flex flex-col justify-center items-center text-center border-b sm:border-b-0 border-theatre-gold/30 relative">
                    <div className="w-12 h-12 rounded-2xl bg-theatre-gold/10 border border-theatre-gold/20 flex items-center justify-center text-theatre-gold mb-3 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    {coupon.introText && (
                      <span className="text-xs uppercase tracking-widest text-theatre-gold font-bold mb-1 block text-center break-words max-w-full">
                        {coupon.introText}
                      </span>
                    )}
                    <h3 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight break-words max-w-full">
                      {discountText}
                    </h3>
                  </div>

                  {/* Right Side: Details & Copy Code */}
                  <div className="flex-grow p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-lg font-serif font-bold text-white tracking-wide group-hover:text-theatre-gold transition-colors duration-300">
                        {coupon.title}
                      </h4>
                      <p className="text-gray-400 font-sans font-light text-sm leading-relaxed whitespace-pre-line">
                        {coupon.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-white/5">
                      {/* Expiry info */}
                      <div className="space-y-1 w-full sm:w-auto">
                        <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-theatre-gold/80" />
                          <span>{expiryText}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
