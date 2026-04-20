'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import StatsBar from '../components/StatsBar';
import CarViewer from '../components/CarViewer';
import ServicesInfo from '../components/ServicesInfo';
import WhyChooseUs from '../components/WhyChooseUs';
import BookingSection from '../components/BookingSection';
import Reviews from '../components/Reviews';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import FloatingBookBtn from '../components/FloatingBookBtn';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      fontFamily: 'var(--font-body)',
      backgroundColor: 'var(--black)',
      color: 'var(--text)',
      opacity: loaded ? 1 : 0,
      transition: 'opacity 0.5s ease'
    }}>
      <Navbar />
      <section id="home"><HeroSlider /></section>
      <StatsBar />
      <section id="explore"><CarViewer /></section>
      <section id="services"><ServicesInfo /></section>
      <section id="why"><WhyChooseUs /></section>
      <section id="booking"><BookingSection /></section>
      <section id="reviews"><Reviews /></section>
      <section id="contact"><ContactSection /></section>
      <footer id="footer"><Footer /></footer>
      <Chatbot />
      <FloatingBookBtn />
    </div>
  );
}
