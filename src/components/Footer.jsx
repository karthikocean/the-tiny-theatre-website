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
      href: '#',
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: '#',
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: '#',
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      )
    },
    {
      name: 'Youtube',
      href: '#',
      svg: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-theatre-grey-deep border-t border-theatre-grey/10 pt-20 pb-8 text-gray-400 font-sans relative overflow-hidden">
      {/* Decorative spotlights or flares */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-theatre-grey/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[85rem] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-10 gap-x-6 lg:gap-x-8 pb-16 border-b border-white/5">
          
          {/* Col 1: Brand Info (Col 1-4) */}
          <div className="lg:col-span-4 space-y-6">
            <a href="#home" onClick={(e) => handleNavClick(e, '/')} className="flex items-center group">
              <img 
                src={logoImg} 
                alt="The Tiny Theatre" 
                className="h-20 w-auto object-contain"
              />
            </a>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Providing premium, luxurious private movie theatre screening halls and bespoke milestone celebration services.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3">
              {socials.map((social, i) => {
                return (
                  <a
                    key={i}
                    href={social.href}
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
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-serif text-base font-bold tracking-wide">Quick Links</h4>
            <ul className="space-y-3.5 text-sm font-light">
              {[
                { name: 'Home', href: '#home', path: '/', icon: Home },
                { name: 'Offers', href: '#offers', path: '/offers', icon: Sparkles },
                { name: 'Why Choose Us', href: '#why-choose-us', path: '/why-choose-us', icon: Award },
                { name: 'Booking Process', href: '#booking-process', path: '/booking-process', icon: Calendar },
                { name: 'Gallery', href: '#gallery', path: '/gallery', icon: Image },
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
          <div className="lg:col-span-3 space-y-6">
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

          {/* Col 4: Box Office Info */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white font-serif text-base font-bold tracking-wide">Box Office Info</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4.5 h-4.5 text-theatre-gold mt-0.5 flex-shrink-0" />
                <span>UMA Complex, Off Radial Road, Ram Nagar South Extn 12th Street, Pallikaranai, Chennai - 600100</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4.5 h-4.5 text-theatre-gold flex-shrink-0" />
                <a href="tel:+917338848840" className="hover:text-theatre-gold transition-colors duration-300">
                  +91 7338848840
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4.5 h-4.5 text-theatre-gold flex-shrink-0" />
                <a href="mailto:bookings@tinytheatre.com" className="hover:text-theatre-gold transition-colors duration-300">
                  bookings@tinytheatre.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-sm font-light text-gray-500 gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p>© {new Date().getFullYear()} The Tiny Theatre Inc. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <h1 className="text-[14px] text-gray-500">
              Designed and Maintained by <a href="https://www.oceansoftwares.com/" target="_blank" rel="noopener noreferrer" className="hover:text-theatre-gold text-gray-500 hover:underline transition-colors duration-300">Ocean Softwares</a>
            </h1>
          </div>
        </div>

      </div>
    </footer>
  );
}
