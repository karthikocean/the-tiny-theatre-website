import { useState, useEffect } from 'react';
import { Menu, X, Phone, Ticket } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Home', href: '#home', path: '/' },
    { name: 'Why Choose Us', href: '#why-choose-us', path: '/why-choose-us' },
    { name: 'Booking Process', href: '#booking-process', path: '/booking-process' },
    { name: 'Gallery', href: '#gallery', path: '/gallery' },
    { name: 'Offers', href: '#offers', path: '/offers' },
    { name: 'Contact Us', href: '#book-now', path: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (location.pathname !== '/' && path.startsWith('#')) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(path.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(path);
      const element = document.getElementById(path.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const handleBookNowClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    navigate('/book-now');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-dark py-3 shadow-lg shadow-theatre-grey-deep/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-16">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center group cursor-pointer"
          >
            <img 
              src={logoImg} 
              alt="The Tiny Theatre" 
              className="h-12 sm:h-16 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-6">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={`text-xs xl:text-sm font-medium tracking-wide transition-all duration-300 hover:text-theatre-gold relative py-1 ${
                    isActive
                      ? 'text-theatre-gold font-semibold'
                      : 'text-gray-300'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-theatre-gold rounded-full" />
                  )}
                </a>
              );
            })}
            
            {/* Call Icon Button */}
            <a
              href="tel:+917338848840"
              title="Call Us"
              className="w-10 h-10 bg-transparent border border-blue-500/80 hover:border-blue-500 text-blue-500 hover:bg-blue-500/10 hover:scale-110 transition-all duration-300 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
            >
              <Phone className="w-4 h-4 xl:w-4.5 xl:h-4.5 text-blue-500" />
            </a>

            {/* WhatsApp Icon Button */}
            <a
              href="https://wa.me/917338848840"
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Chat"
              className="w-10 h-10 bg-transparent border border-[#25D366]/80 hover:border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 hover:scale-110 transition-all duration-300 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
            >
              <svg className="w-4.5 h-4.5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.963L2 22l5.233-1.371a9.924 9.924 0 0 0 4.779 1.218h.004c5.506 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.18-2.92-7.062C17.182 3.018 14.676 2 12.012 2zm5.726 14.123c-.253.715-1.246 1.304-1.71 1.353-.42.043-.972.072-1.564-.117-.367-.118-.838-.283-1.429-.538-2.52-1.04-4.148-3.641-4.275-3.81-.124-.168-.926-1.24-.926-2.36 0-1.123.582-1.674.793-1.897.21-.223.46-.279.614-.279.155 0 .31.002.444.009.141.007.33-.053.516.398.192.463.655 1.604.713 1.722.059.12.098.26.019.418-.08.157-.12.254-.24.394-.12.14-.251.312-.359.418-.12.118-.246.248-.106.49.14.242.624 1.03 1.34 1.666.924.821 1.7 1.077 1.942 1.197.242.12.384.1.528-.066.142-.167.625-.73 1.134-1.285.25-.274.522-.293.818-.184.298.11 1.888.892 2.21 1.055.321.162.534.242.612.378.078.136.078.79-.175 1.505z" />
              </svg>
            </a>

            <a
              href="/book-now"
              onClick={handleBookNowClick}
              className="bg-theatre-gold hover:bg-theatre-gold-light text-theatre-grey-deep px-4 py-2.5 xl:px-5 xl:py-3 rounded-xl font-bold text-xs xl:text-sm shadow-md hover:shadow-lg shadow-theatre-gold/20 hover:shadow-theatre-gold/30 hover:scale-105 transition-all duration-300 cursor-pointer flex-shrink-0 flex items-center space-x-2"
            >
              <Ticket className="w-4 h-4 xl:w-4.5 xl:h-4.5 text-theatre-grey-deep" />
              <span>Book Now</span>
            </a>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-theatre-grey/20 transition-all duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full glass-dark transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.path)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-theatre-grey/20 text-theatre-gold border-l-4 border-theatre-gold'
                    : 'text-gray-300 hover:bg-theatre-grey/10 hover:text-white'
                }`}
              >
                {item.name}
              </a>
            );
          })}
          <div className="pt-4 px-3 flex flex-col space-y-3">
            <a
              href="#book-now"
              onClick={handleBookNowClick}
              className="block w-full text-center bg-theatre-gold hover:bg-theatre-gold-light text-theatre-grey-deep px-5 py-3 rounded-full font-semibold shadow-md hover:shadow-lg shadow-theatre-gold/20 transition-all duration-300"
            >
              Book Now
            </a>
            
            <div className="flex justify-center space-x-4 pt-1">
              {/* Call Icon */}
              <a
                href="tel:+917338848840"
                className="p-3 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-full border border-blue-500/20 transition-all duration-300 flex items-center justify-center flex-grow"
              >
                <Phone className="w-5 h-5 mr-2" />
                <span className="text-sm font-semibold">Call Us</span>
              </a>

              {/* WhatsApp Icon */}
              <a
                href="https://wa.me/917338848840"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-full border border-[#25D366]/20 transition-all duration-300 flex items-center justify-center flex-grow"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.963L2 22l5.233-1.371a9.924 9.924 0 0 0 4.779 1.218h.004c5.506 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.18-2.92-7.062C17.182 3.018 14.676 2 12.012 2zm5.726 14.123c-.253.715-1.246 1.304-1.71 1.353-.42.043-.972.072-1.564-.117-.367-.118-.838-.283-1.429-.538-2.52-1.04-4.148-3.641-4.275-3.81-.124-.168-.926-1.24-.926-2.36 0-1.123.582-1.674.793-1.897.21-.223.46-.279.614-.279.155 0 .31.002.444.009.141.007.33-.053.516.398.192.463.655 1.604.713 1.722.059.12.098.26.019.418-.08.157-.12.254-.24.394-.12.14-.251.312-.359.418-.12.118-.246.248-.106.49.14.242.624 1.03 1.34 1.666.924.821 1.7 1.077 1.942 1.197.242.12.384.1.528-.066.142-.167.625-.73 1.134-1.285.25-.274.522-.293.818-.184.298.11 1.888.892 2.21 1.055.321.162.534.242.612.378.078.136.078.79-.175 1.505z" />
                </svg>
                <span className="text-sm font-semibold">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
