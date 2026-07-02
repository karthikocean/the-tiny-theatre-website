import React from 'react';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from '../components/About';
import WhyChooseUs from "../components/WhyChooseUs";
import BookingTimeline from "../components/BookingTimeline";
import CelebrationPackages from "../components/CelebrationPackages";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="bg-[#0B0B0B] text-white font-body">
      <Navbar />
      <Hero />
      <About />
      <WhyChooseUs />
      <BookingTimeline />
      <CelebrationPackages />
      <Gallery />
      <Footer />
    </div>
  );
};

export default Home;
