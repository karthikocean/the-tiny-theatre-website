import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Home,
  Sparkles,
  Award,
  Calendar,
  Image,
  FileText,
  ShieldAlert,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Footer() {
  const navigate = useNavigate();

  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const socials = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61591626546921',
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/thetinytheatre',
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-theatre-grey-deep border-t border-theatre-grey/10 pt-20 pb-8 text-gray-400 font-sans relative overflow-hidden">
      {/* Decorative spotlights or flares */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-theatre-grey/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 xl:px-28 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-y-10 gap-x-6 lg:gap-x-8 pb-8 sm:pb-16 border-b border-white/5">

          {/* Col 1: Brand Info (Col 1-4) */}
          <div className="col-span-2 md:col-span-1 lg:col-span-4 space-y-6">
            <a href="#home" onClick={(e) => handleNavClick(e, '/')} className="flex items-center group">
              <img
                src={logoImg}
                alt="The Tiny Theatre"
                className="h-28 sm:h-32 w-auto object-contain"
              />
            </a>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Experience Premium Private screenings and personalised celebrations in Tambaram, with the perfect setting for binge watch, special occasions, and unforgettable moments.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3">
              {socials.map((social, i) => {
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className="p-2.5 bg-white/5 hover:bg-theatre-gold text-gray-400 hover:text-theatre-grey-deep rounded-xl border border-white/5 hover:scale-110 transition-all duration-300 flex items-center justify-center"
                  >
                    {social.svg}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Quick Links (Col 5-6) */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <h4 className="text-white font-serif text-base font-bold tracking-wide">Quick Links</h4>
            <ul className="space-y-3.5 text-sm font-light">
              {[
                { name: 'Home', href: '#home', path: '/', icon: Home },
                { name: 'Why Choose Us', href: '#why-choose-us', path: '/why-choose-us', icon: Award },
                { name: 'Features', href: '#features', path: '/features', icon: Sparkles },
                { name: 'Booking Process', href: '#booking-process', path: '/booking-process', icon: Calendar },
                { name: 'Gallery', href: '#gallery', path: '/gallery', icon: Image },
                { name: 'Offers', href: '#offers', path: '/offers', icon: Sparkles },
                { name: 'Contact Us', href: '#contact-us', path: '/contact', icon: Mail },
              ].map((link) => {
                const LinkIcon = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.path)}
                      className="hover:text-theatre-gold transition-colors duration-300 flex items-center space-x-2.5"
                    >
                      <LinkIcon className="w-4 h-4 text-theatre-gold/80 flex-shrink-0" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Policies & Support (Col 7-9) */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            <h4 className="text-white font-serif text-base font-bold tracking-wide">Policies & Support</h4>
            <ul className="space-y-3.5 text-sm font-light">
              {[
                { name: 'Terms & Conditions', href: '#terms-and-conditions', path: '/terms-and-conditions', icon: FileText },
                { name: 'Privacy Policy', href: '/privacy-policy', path: '/privacy-policy', icon: ShieldAlert },
                { name: 'Cancellation & Refund Policy', href: '/cancellation-policy', path: '/cancellation-policy', icon: RotateCcw },
                { name: 'House Rules', href: '/house-rules', path: '/house-rules', icon: BookOpen },
              ].map((link) => {
                const LinkIcon = link.icon;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.path)}
                      className="hover:text-theatre-gold transition-colors duration-300 flex items-center space-x-2.5"
                    >
                      <LinkIcon className="w-4 h-4 text-theatre-gold/80 flex-shrink-0" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 lg:col-span-3 space-y-6">
            <h4 className="text-white font-serif text-base font-bold tracking-wide">Visit Us</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4.5 h-4.5 text-theatre-gold mt-0.5 flex-shrink-0" />
                <div className="flex flex-col space-y-0.5">
                  <span>Uma Complex,</span>
                  <span>Plot No. 14, Professor's Colony Extension,</span>
                  <span>IAF Road, East Tambaram, Chennai,</span>
                  <span>Tamil Nadu - 600 059.</span>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4.5 h-4.5 text-theatre-gold flex-shrink-0" />
                <a href="tel:+917338848840" className="hover:text-theatre-gold transition-colors duration-300">
                  +91 73388 48840
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4.5 h-4.5 text-theatre-gold flex-shrink-0" />
                <a href="mailto:info@thetinytheatre.in" className="hover:text-theatre-gold transition-colors duration-300">
                  info@thetinytheatre.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center pt-8 text-sm font-light text-gray-500 gap-4 text-center">
          <div>
            <p>© {new Date().getFullYear()} The Tiny Theatre. All rights reserved.</p>
          </div>
          <div>
            <h1 className="text-[14px] text-gray-500 text-center lg:text-right">
              Designed and Maintained by <a href="https://www.oceansoftwares.com/" target="_blank" rel="noopener noreferrer" className=" transition-colors duration-300 block sm:inline mt-1 sm:mt-0">Ocean Softwares Private Limited</a>
            </h1>
          </div>
        </div>

      </div>
    </footer>
  );
}
