import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Tv,
  Calendar,
  UserCheck,
  Users,
  Sparkles,
  Cake,
  PlusCircle,
  ClipboardCheck,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

export default function BookingProcess({ preview, onViewMore }) {
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      title: 'Choose Your Screen',
      emoji: '🎬',
      desc: 'Find the perfect screen for your celebration. Choose from our two screens, based on your group size and preferred seating capacity.',
      icon: Tv,
      details: []
    },
    {
      step: '02',
      title: 'Pick Your Date & Time',
      emoji: '📅',
      desc: 'Select your preferred date and time from the available slots. Our real-time availability ensures a smooth and seamless booking process.',
      icon: Calendar,
      details: []
    },
    {
      step: '03',
      title: 'Select Number of Guests',
      emoji: '👥',
      desc: "Let us know your guest count, and we'll take care of the rest. Your pricing is automatically calculated based on the screen you choose and the number of guests.",
      icon: Users,
      details: []
    },
    {
      step: '04',
      title: 'Choose Your Occasion',
      emoji: '🎉',
      desc: 'Make Your Celebration truly yours. Choose the occasion that brings everyone together.',
      icon: Sparkles,
      details: [
        'Binge Watch',
        'Birthday celebration',
        'Anniversary',
        'Romantic Date',
        'Proposal',
        'Bride-to-be',
        'Groom-to-be',
        'Farewell',
        'Baby shower',
        'Kitty Party',
        'Family/Friends Get-Together',
        'Corporate Event',
        'Other Special Occasion'
      ]
    },
    {
      step: '05',
      title: 'Cake Selection',
      emoji: '🎂',
      desc: 'Make your Special Moment even sweeter. Choose from our delicious cake flavours - you can select multiple flavours for your celebration.',
      icon: Cake,
      details: []
    },
    {
      step: '06',
      title: 'Optional Decoration',
      emoji: '🎊',
      desc: 'Add a special touch to your experience by choosing from our Optional Decoration for your screening room.',
      icon: PlusCircle,
      details: []
    },
    {
      step: '07',
      title: 'Celebration Add-ons',
      emoji: '✨',
      desc: 'Add bespoke experiences and thoughtful touches to make your celebration truly unforgettable:',
      icon: Sparkles,
      details: [
        'Fog Entry',
        'LED Numbers',
        'Event sash',
        'Crown',
        'Karaoke setup and much more..',
      ]
    },
    {
      step: '08',
      title: 'Tell Us About You',
      emoji: '👤',
      desc: 'Enter your details to complete your booking:',
      icon: UserCheck,
      details: [
        'Full Name',
        'Email Address',
        'Mobile Number (OTP Verification)'
      ]
    },
    {
      step: '09',
      title: 'Pay Advance Amount',
      emoji: '💳',
      desc: 'Secure your booking instantly. Pay the required ₹1,000 advance using our secure online payment gateway.',
      icon: CreditCard,
      details: []
    },
    {
      step: '10',
      title: 'Booking Confirmation',
      emoji: '✅',
      desc: "You're all set! Your private theatre experience is officially reserved. Once the payment is successfully completed, you'll receive Booking Confirmation via SMS (or) WhatsApp and email.",
      icon: CheckCircle2,
      details: []
    }
  ];

  return (
    <section id="booking-process" className="relative py-12 bg-theatre-dark overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-theatre-grey/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-theatre-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[85rem] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs mb-4 block">
            How It Works
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            Booking Process <br className="hidden sm:inline" />
            <span className="text-theatre-grey">Simple & Professional Steps</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full mb-8" />
          <p className="text-gray-400 text-sm sm:text-base font-sans font-light">
           Your Celebration starts here - Follow our simple booking process 
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative">

          {preview ? (
            /* Homepage Preview: Compact 3-card grid */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {steps.slice(0, 3).map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="bg-theatre-grey-deep/20 backdrop-blur-sm border border-white/5 hover:border-theatre-gold/30 rounded-3xl p-6 relative group flex flex-col items-center text-center transition-all duration-300"
                  >
                    {/* Circle Background */}
                    <div className="w-16 h-16 rounded-full bg-theatre-grey-deep border border-theatre-gold/30 group-hover:border-theatre-gold flex items-center justify-center transition-all duration-500 mb-6 relative">
                      <StepIcon className="w-6 h-6 text-gray-400 group-hover:text-theatre-gold transition-colors duration-500" />
                      <span className="absolute -top-1 -right-1 bg-theatre-gold text-theatre-grey-deep font-sans text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-theatre-dark">
                        {step.step}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-white mb-3 group-hover:text-theatre-gold transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans font-light">
                      {step.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Detailed Page: Zig-Zag Timeline */
            <div className="relative">
              {/* Timeline Center line */}
              <div className="absolute left-6 sm:left-8 lg:left-1/2 lg:-translate-x-1/2 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-theatre-gold/30" />

              <div className="space-y-12 lg:space-y-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isEven = index % 2 === 1;
                  return (
                    <div
                      key={step.title}
                      className={`relative flex flex-col lg:flex-row ${isEven ? 'lg:flex-row-reverse' : ''} lg:items-center w-full`}
                    >
                      {/* Circle Node (Number bullet) */}
                      <div className="absolute left-6 sm:left-8 lg:left-1/2 lg:-translate-x-1/2 z-20 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4 }}
                          className="w-12 h-12 rounded-full bg-theatre-grey-deep border-2 border-theatre-gold/50 flex items-center justify-center shadow-lg shadow-theatre-gold/20 relative"
                        >
                          <span className="text-theatre-gold text-sm font-sans font-bold">{step.step}</span>
                        </motion.div>
                      </div>

                      {/* Card Content Area */}
                      <div className="pl-16 lg:pl-0 w-full lg:w-[45%]">
                        <motion.div
                          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: '-100px' }}
                          transition={{ duration: 0.6 }}
                          className="bg-theatre-grey-deep/20 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/5 hover:border-theatre-gold/30 transition-all duration-300 relative group"
                        >
                          {/* Card Header with Icon */}
                          <div className="flex items-center space-x-3.5 mb-4">
                            <div className="p-2.5 bg-theatre-gold/10 rounded-2xl border border-theatre-gold/20 text-theatre-gold group-hover:bg-theatre-gold group-hover:text-theatre-grey-deep transition-all duration-500 flex-shrink-0">
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-theatre-gold transition-colors duration-300">
                              {step.title}
                            </h3>
                          </div>

                          {/* Card Description */}
                          <p className="text-sm text-gray-400 font-sans font-light leading-relaxed">
                            {step.desc}
                          </p>

                          {/* Step Specific Details Grid */}
                          {step.details && step.details.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-400 font-sans font-light">
                                {step.details.map((detail, idx) => (
                                  <li key={idx} className="flex items-center space-x-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-theatre-gold/60 flex-shrink-0" />
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* Spacer for desktop alignment */}
                      <div className="hidden lg:block w-[45%]" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Homepage call-to-action */}
          {preview ? (
            <div className="text-center mt-16">
              <button
                onClick={onViewMore}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep font-bold px-8 py-4 rounded-full shadow-lg shadow-theatre-gold/15 hover:shadow-theatre-gold/25 hover:scale-105 transition-all duration-300 text-sm cursor-pointer"
              >
                <span>View Complete Process</span>
              </button>
            </div>
          ) : (
            /* Detailed Page Footer Call to Action (Small Footer Section) */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-24 max-w-4xl mx-auto text-center bg-gradient-to-br from-theatre-grey-deep/30 to-theatre-grey-deep/10 border border-theatre-gold/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden backdrop-blur-md"
            >
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-theatre-gold/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-theatre-grey/5 rounded-full blur-3xl pointer-events-none" />

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to Make Memories That Last?
              </h3>
              <p className="text-gray-400 text-sm sm:text-base font-sans font-light max-w-2xl mx-auto mb-8 leading-relaxed">
                Your private theatre experience is just a few simple steps away. Book your own screen and turn every celebration and special moment into a memory worth reliving.
              </p>
              <button
                onClick={() => navigate('/book-now')}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep font-bold px-8 py-4 rounded-full shadow-lg shadow-theatre-gold/15 hover:shadow-theatre-gold/25 hover:scale-105 transition-all duration-300 text-sm cursor-pointer uppercase tracking-wider"
              >
                <span>RESERVE NOW</span>
              </button>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}
