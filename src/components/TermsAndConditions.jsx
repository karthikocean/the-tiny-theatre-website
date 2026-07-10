import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { getTerms } from '../Api/Termsapi';

export default function TermsAndConditions() {
  const [termsData, setTermsData] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await getTerms({ title: 'Terms' });
        if (res.status && res.response?.data?.length > 0) {
          setTermsData(res.response.data[0]);
        }
      } catch (err) {
        console.error("Error fetching terms:", err);
      }
    };
    fetchTerms();
  }, []);

  const fallbackSections = [
    {
      id: 1,
      title: "Bookings",
      content: [
        "All bookings are subject to availability.",
        "A booking is confirmed only after the required advance payment is received.",
        "The booking confirmation will be shared through the contact details provided by the customer."
      ]
    },
    {
      id: 2,
      title: "Payments",
      content: [
        "Advance payment is required to confirm your reservation.",
        "The remaining balance, if any, must be paid before the start of your session unless otherwise agreed.",
        "Prices are subject to change without prior notice; however, confirmed bookings will be charged at the agreed price."
      ]
    },
    {
      id: 3,
      title: "Cancellation & Rescheduling",
      content: [
        "Cancellation and rescheduling requests must be made within the time limits communicated at the time of booking.",
        "Refund eligibility, if any, will depend on the applicable cancellation policy.",
        "The Tiny Theatre reserves the right to cancel or reschedule a booking due to unforeseen circumstances. In such cases, customers will be offered an alternative slot or an appropriate refund, where applicable."
      ]
    },
    {
      id: 4,
      title: "Arrival & Session Timing",
      content: [
        "Guests are requested to arrive 10–15 minutes before the scheduled booking time.",
        "Sessions start and end as per the confirmed schedule.",
        "Late arrival may reduce the available viewing time, and extensions are subject to availability and additional charges."
      ]
    },
    {
      id: 5,
      title: "Guest Conduct",
      content: [
        "To ensure a pleasant experience for everyone:",
        "Treat staff, equipment, furniture, and décor with respect.",
        "Follow all safety instructions provided by our team.",
        "Avoid any behaviour that may disturb others or damage the property."
      ]
    },
    {
      id: 6,
      title: "Damage to Property",
      content: [
        "Customers may be held responsible for any intentional or negligent damage caused to the theatre, equipment, furniture, or decorations during their booking."
      ]
    },
    {
      id: 7,
      title: "Food & Decorations",
      content: [
        "Food, beverages, cakes, and decoration services are subject to availability and package selection.",
        "Outside food or decorations may be permitted only with prior approval."
      ]
    },
    {
      id: 8,
      title: "Content Responsibility",
      content: [
        "Customers are responsible for ensuring they have the legal right to play or stream any movies, music, videos, photos, or other content they bring to the theatre. The Tiny Theatre is not responsible for any copyright or licensing violations arising from customer-provided content."
      ]
    },
    {
      id: 9,
      title: "Safety",
      content: [
        "Guests must comply with all safety instructions and emergency procedures while on the premises."
      ]
    },
    {
      id: 10,
      title: "Photography & Social Media",
      content: [
        "The Tiny Theatre may capture photographs or videos for promotional purposes only with the customer's permission. If you prefer not to be photographed, please inform our team before your session."
      ]
    },
    {
      id: 11,
      title: "Limitation of Liability",
      content: [
        "While we strive to provide an excellent experience, The Tiny Theatre is not liable for delays, interruptions, or cancellations caused by events beyond our reasonable control, including power outages, internet disruptions, equipment failures, or natural disasters."
      ]
    },
    {
      id: 12,
      title: "Privacy",
      content: [
        "Personal information collected during booking will be used only to manage reservations, communicate with customers, process payments, and improve our services. We do not sell personal information to third parties."
      ]
    },
    {
      id: 13,
      title: "Changes to These Terms",
      content: [
        "The Tiny Theatre may update these Terms & Conditions from time to time. The latest version will always be available on our website."
      ]
    },
    {
      id: 14,
      title: "Contact Us",
      content: [
        "If you have any questions regarding these Terms & Conditions, please contact us using the details provided on our Contact page."
      ]
    }
  ];

  const displayIntro = termsData?.introText || "Welcome to The Tiny Theatre. By making a booking or using our services, you agree to the following Terms & Conditions.";

  const displaySections = termsData?.sections
    ? termsData.sections.map((section, idx) => ({
        id: idx + 1,
        title: section.title,
        content: section.points || []
      }))
    : fallbackSections;

  const displayLastUpdated = termsData?.updatedAt
    ? `Last Updated: ${new Date(termsData.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    : "Last Updated: July 2026";

  return (
    <section className="relative py-24 bg-theatre-dark min-h-screen overflow-hidden">
      {/* Premium ambient glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-theatre-grey/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-theatre-gold/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        

        {/* Subtitle */}
        <div className="text-center mb-2">
          <span className="text-theatre-gold text-xs font-semibold tracking-[0.25em] uppercase">
            → HOUSE POLICIES ←
          </span>
        </div>

        {/* Title */}
        <h1 className="text-center font-serif text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Terms & <span className="text-theatre-gold">Conditions</span>
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

        {/* Introduction */}
        <div className="bg-theatre-grey-deep/30 border border-theatre-gold/25 rounded-2xl p-6 sm:p-8 mb-12 text-gray-300 font-sans font-light leading-relaxed text-center sm:text-left">
          {displayIntro}
        </div>

        {/* Clause List */}
        <div className="space-y-12">
          {displaySections.map((section, idx) => (
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
            Thank you for reviewing our terms. We look forward to hosting your exclusive blockbusters and milestones at The Tiny Theatre!
          </p>
        </div>

      </div>
    </section>
  );
}
