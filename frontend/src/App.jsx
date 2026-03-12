import Footer from './components/Footer';
import React from 'react';
import HeroSlider from './components/HeroSlider';
import CarViewer from './components/CarViewer';
import ServicesInfo from './components/ServicesInfo';
import BookingForm from './components/BookingForm';
import Reviews from './components/Reviews';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
      
      {/* 1. Top Slideshow */}
      <HeroSlider />

      {/* 2. 3D Car Viewer Section */}
      <section style={{ height: '70vh', backgroundColor: '#111', position: 'relative' }}>
        <h2 style={{ position: 'absolute', top: 30, left: 30, color: 'white', zIndex: 10, margin: 0 }}>
          Explore Our Finish
        </h2>
        <CarViewer />
      </section>

      {/* 3. Services Information */}
      <ServicesInfo />

      {/* 4. Booking & Reviews (Side by side on large screens) */}
      <section style={{ display: 'flex', flexWrap: 'wrap', padding: '4rem 2rem', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Left Side: Booking */}
        <div style={{ flex: '1 1 500px' }}>
          <h2 style={{ color: '#333', fontSize: '2rem', marginBottom: '1rem' }}>Book Your Appointment</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>Ready to transform your vehicle? Select a service and a date, and we'll secure your spot.</p>
          <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <BookingForm />
          </div>
        </div>

        {/* Right Side: Reviews */}
        <div style={{ flex: '1 1 400px' }}>
          <Reviews />
        </div>
      </section>

     {/* 5. Footer & Contact */}
      <Footer />

    </div>
  );
}

export default App;