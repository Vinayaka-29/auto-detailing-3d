import React from "react";
import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import CarViewer from "./components/CarViewer";
import ServicesInfo from "./components/ServicesInfo";
import BookingForm from "./components/BookingForm";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#0a0a0a",
        color: "white"
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="home">
        <HeroSlider />
      </section>

      {/* BMW Viewer */}
      <section
        id="explore"
        style={{
          height: "100vh",
          background: "radial-gradient(circle at center,#1a1a1a,#000)",
          position: "relative"
        }}
      >
        <h2
          style={{
            position: "absolute",
            top: 30,
            left: 30,
            zIndex: 10
          }}
        >
          Explore Our Finish
        </h2>

        <CarViewer />
      </section>

      {/* Services */}
      <section id="services">
        <ServicesInfo />
      </section>

      {/* Booking + Reviews */}
      <section
        id="booking"
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "4rem 2rem",
          gap: "3rem",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {/* Booking */}
        <div style={{ flex: "1 1 500px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Book Your Appointment
          </h2>

          <p style={{ color: "#aaa", marginBottom: "2rem" }}>
            Ready to transform your vehicle? Select a service and a date.
          </p>

          <div
            style={{
              padding: "2rem",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
          >
            <BookingForm />
          </div>
        </div>

        {/* Reviews */}
        <div style={{ flex: "1 1 400px" }}>
          <Reviews />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact">
        <Footer />
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;