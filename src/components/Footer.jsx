// src/components/Footer.jsx
import React from 'react';
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import '../styles/Footer.module.css';

function Footer() {
  return (
    <footer className="bg-darkBg text-secondaryText py-10" id="contact">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-heading text-xl mb-4">The Tiny Theatre</h3>
          <p>© 2026 The Tiny Theatre. All rights reserved.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">Quick Links</h4>
          <ul>
            <li><a href="#home" className="hover:text-primary">Home</a></li>
            <li><a href="#about" className="hover:text-primary">About</a></li>
            <li><a href="#book" className="hover:text-primary">Book Now</a></li>
            <li><a href="#services" className="hover:text-primary">Services</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-2">Contact</h4>
          <p>123 Cinema Lane<br/>City, Country</p>
          <p>Phone: +1 234 567 890</p>
          <p>Email: info@tinytheatre.com</p>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-secondaryText hover:text-primary"><FaInstagram size={24} /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-secondaryText hover:text-primary"><FaFacebookF size={24} /></a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-secondaryText hover:text-primary"><FaWhatsapp size={24} /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
