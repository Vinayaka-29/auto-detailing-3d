import React, { useEffect, useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import StatsBar from "./components/StatsBar";
import CarViewer from "./components/CarViewer";
import ServicesInfo from "./components/ServicesInfo";
import BookingSection from "./components/BookingSection";
import Reviews from "./components/Reviews";
import WhyChooseUs from "./components/WhyChooseUs";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import FloatingBookBtn from "./components/FloatingBookBtn";

function App() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)", backgroundColor: "var(--black)", color: "var(--text)", opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}>
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
export default App;
