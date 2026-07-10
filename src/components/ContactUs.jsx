import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare, AlertCircle, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addContact } from '../Api/ContactApi';
import ShowNotifications from '../helper/showNotification';

export default function ContactUs({ selectedEventName, clearSelectedEvent }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',

    message: selectedEventName ? `Interested in booking: ${selectedEventName}` : '',
  });
  

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'Full Name is required.';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email.';
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone)) {
      tempErrors.phone = 'Please enter a valid phone number (min 10 digits).';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData, "formadata");
      setIsSubmitting(true);
      const res = await addContact(formData);
      setIsSubmitting(false);
      
      if (res && res.status) {
        ShowNotifications.showAlertNotification("Submitted successfully", true);
        handleReset();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7B8491', '#F4C430', '#FFFFFF']
        });
      }
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      message: '',
    });
    setErrors({});
    if (clearSelectedEvent) {
      clearSelectedEvent();
    }
  };

  return (
    <section id="contact-us" className="relative py-24 bg-theatre-dark/95 overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-theatre-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[85rem] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs mb-4 block">
            Contact Us
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Get in Touch & <br className="hidden sm:inline" />
            <span className="text-theatre-grey">Ask Us Anything</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full mb-8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Google Map Embed */}
          <div className="lg:col-span-6 bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl p-3 border border-theatre-gold/45 shadow-xl overflow-hidden min-h-[450px] flex flex-col">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.889493694166!2d80.12429867454573!3d12.914823416121624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525f0072aa223d%3A0x864d12b68c18b61!2sUMA%20COMPLEX!5e0!3m2!1sen!2sin!4v1783315027393!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '430px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="strict-origin-when-cross-origin"
              className="rounded-2xl flex-grow"
            />
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-6 bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-theatre-gold/45 shadow-xl flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="E.g., John Doe"
                      className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 focus:border-theatre-gold focus:ring-1 focus:ring-theatre-gold transition-all duration-300 text-sm placeholder:text-gray-600 outline-none"
                    />
                  </div>
                  {errors.fullName && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="flex items-center space-x-1 text-red-500 text-xs mt-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.fullName}</span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="E.g., john@example.com"
                      className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 focus:border-theatre-gold focus:ring-1 focus:ring-theatre-gold transition-all duration-300 text-sm placeholder:text-gray-600 outline-none"
                    />
                  </div>
                  {errors.email && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="flex items-center space-x-1 text-red-500 text-xs mt-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Row 2: Phone */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="E.g., +91 98765 43210"
                    className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 focus:border-theatre-gold focus:ring-1 focus:ring-theatre-gold transition-all duration-300 text-sm placeholder:text-gray-600 outline-none"
                  />
                </div>
                {errors.phone && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="flex items-center space-x-1 text-red-500 text-xs mt-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.phone}</span>
                  </motion.div>
                )}
              </div>

              {/* Row 3: Message */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 block">Special Request / Message (Optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4.5 w-4.5 h-4.5 text-gray-500" />
                  <textarea
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="E.g., Custom balloon decorations, catering requirements, or presentation setup..."
                    className="w-full bg-theatre-dark/60 text-white pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 focus:border-theatre-gold focus:ring-1 focus:ring-theatre-gold transition-all duration-300 text-sm placeholder:text-gray-600 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Submission button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-theatre-gold to-theatre-gold-dark hover:from-theatre-gold-light hover:to-theatre-gold text-theatre-grey-deep font-bold py-4 rounded-2xl shadow-lg hover:shadow-theatre-gold/20 flex items-center justify-center space-x-2 text-base transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-5 h-5 text-theatre-grey-deep" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Send Inquiry Request'}</span>
                </button>
              </div>

            </form>
          </div>

        </div>

        <div className="mt-24 text-center">
          <span className="text-theatre-gold font-semibold tracking-widest uppercase text-xs mb-4 block">
            Where to Find Us
          </span>
        
          <div className="w-16 h-0.5 bg-gradient-to-r from-theatre-gold to-theatre-grey rounded-full mx-auto mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Card 1: Corporate Office (Glass Style) */}
            <div className="bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl hover:border-theatre-gold/25 transition-all duration-300 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-full bg-theatre-gold/10 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-theatre-gold" />
              </div>
              <div className="w-8 h-px bg-theatre-gold/30 mb-4" />
              <h4 className="text-white font-sans text-lg font-bold tracking-wide mb-3">Corporate Office</h4>
              <p className="text-gray-400 font-sans font-light text-sm leading-relaxed">
                UMA COMPLEX, Plot No : 324,<br />
                Off Radial Road, Ram Nagar,<br />
                Pallikaranai, Chennai - 600 100.
              </p>
            </div>

            {/* Card 2: Call Support (Glass Style) */}
            <div className="bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl hover:border-theatre-gold/25 transition-all duration-300 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-full bg-theatre-gold/10 flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-theatre-gold" />
              </div>
              <div className="w-8 h-px bg-theatre-gold/30 mb-4" />
              <h4 className="text-white font-sans text-lg font-bold tracking-wide mb-3">Call Support</h4>
              <p className="text-gray-400 font-sans font-light text-sm leading-relaxed space-y-1">
                       <span>+91 7338848840</span>
              </p>
            </div>

            {/* Card 3: Email Inquiry (Glass Style) */}
            <div className="bg-theatre-grey-deep/15 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl hover:border-theatre-gold/25 transition-all duration-300 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-full bg-theatre-gold/10 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-theatre-gold" />
              </div>
              <div className="w-8 h-px bg-theatre-gold/30 mb-4" />
              <h4 className="text-white font-sans text-lg font-bold tracking-wide mb-3">Email Inquiry</h4>
              <p className="text-gray-400 font-sans font-light text-sm leading-relaxed space-y-1">
                <a href="mailto:bookings@tinytheatre.com" className="hover:text-theatre-gold transition-colors duration-300 block">
                  bookings@tinytheatre.com
                </a>
                <a href="mailto:info@tinytheatre.com" className="hover:text-theatre-gold transition-colors duration-300 block">
                  info@tinytheatre.com
                </a>
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
