import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const collectedInfo = [
    "Name",
    "Mobile number",
    "Email address",
    "Booking details",
    "Payment information (processed through secure payment providers)",
    "Messages or enquiries submitted through our website or WhatsApp"
  ];

  const infoUsage = [
    "Confirm and manage bookings",
    "Communicate about your reservation",
    "Process payments",
    "Provide customer support",
    "Improve our services",
    "Send booking confirmations and important updates"
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
            → SECURITY & PRIVACY ←
          </span>
        </div>

        {/* Title */}
        <h1 className="text-center font-serif text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Privacy <span className="text-theatre-gold">Policy</span>
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
        <div className="bg-theatre-grey-deep/30 border border-theatre-gold/25 rounded-2xl p-6 sm:p-8 mb-16 text-gray-300 font-sans font-light leading-relaxed text-center sm:text-left">
          At The Tiny Theatre, we value your privacy and are committed to protecting your personal information.
        </div>

        {/* Policy Sections */}
        <div className="space-y-16">
          {/* Section 1: Information We Collect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-serif text-2xl font-bold text-white tracking-wide border-b border-white/5 pb-2">
              Information We Collect
            </h3>
            <p className="text-gray-300 font-sans font-light text-base sm:text-lg leading-relaxed mb-4">
              We may collect:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {collectedInfo.map((info, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-gray-300 font-sans font-light text-base leading-relaxed bg-theatre-grey-deep/20 p-3.5 rounded-xl border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-theatre-gold mt-2 flex-shrink-0" />
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Section 2: How We Use Your Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-serif text-2xl font-bold text-white tracking-wide border-b border-white/5 pb-2">
              How We Use Your Information
            </h3>
            <p className="text-gray-300 font-sans font-light text-base sm:text-lg leading-relaxed mb-4">
              Your information is used to:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoUsage.map((usage, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-gray-300 font-sans font-light text-base leading-relaxed bg-theatre-grey-deep/20 p-3.5 rounded-xl border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-theatre-gold mt-2 flex-shrink-0" />
                  <span>{usage}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-300 font-sans font-light text-base sm:text-lg leading-relaxed mt-4 pt-2">
              We may also send promotional offers if you have chosen to receive them. You can opt out at any time.
            </p>
          </motion.div>

          {/* Section 3: Information Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-serif text-2xl font-bold text-white tracking-wide border-b border-white/5 pb-2">
              Information Sharing
            </h3>
            <p className="text-gray-300 font-sans font-light text-base sm:text-lg leading-relaxed">
              We do not sell or rent your personal information. We may share information only with trusted service providers who help us process payments, manage bookings, or operate our business, and only as necessary.
            </p>
          </motion.div>

          {/* Section 4: Data Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-serif text-2xl font-bold text-white tracking-wide border-b border-white/5 pb-2">
              Data Security
            </h3>
            <p className="text-gray-300 font-sans font-light text-base sm:text-lg leading-relaxed">
              We take reasonable technical and organisational measures to safeguard your personal information. However, no method of electronic storage or transmission is completely secure.
            </p>
          </motion.div>

          {/* Section 5: Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-serif text-2xl font-bold text-white tracking-wide border-b border-white/5 pb-2">
              Cookies
            </h3>
            <p className="text-gray-300 font-sans font-light text-base sm:text-lg leading-relaxed">
              Our website may use cookies and similar technologies to improve your browsing experience, analyse website usage, and enhance our services.
            </p>
          </motion.div>

          {/* Section 6: Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-serif text-2xl font-bold text-white tracking-wide border-b border-white/5 pb-2">
              Your Rights
            </h3>
            <p className="text-gray-300 font-sans font-light text-base sm:text-lg leading-relaxed">
              You may request access to, correction of, or deletion of your personal information, subject to applicable legal requirements.
            </p>
          </motion.div>

          {/* Section 7: Policy Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="font-serif text-2xl font-bold text-white tracking-wide border-b border-white/5 pb-2">
              Policy Updates
            </h3>
            <p className="text-gray-300 font-sans font-light text-base sm:text-lg leading-relaxed">
              We may update this Privacy Policy from time to time. The latest version will always be available on our website.
            </p>
          </motion.div>
        </div>

        {/* End Note */}
        <div className="mt-20 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-theatre-grey/10 border border-theatre-gold/50 rounded-full flex items-center justify-center shadow-lg mb-4">
            <Shield className="w-5 h-5 text-theatre-gold" />
          </div>
          <p className="text-gray-400 text-sm font-sans font-light leading-relaxed max-w-md">
            If you have any questions or concerns regarding this Privacy Policy, please contact our privacy officer at bookings@tinytheatre.com.
          </p>
        </div>

      </div>
    </section>
  );
}
