const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Route for Bookings
app.post('/api/book', (req, res) => {
  const { name, phone, service, date } = req.body;
  console.log("New booking received:", req.body);
  
  // Later, we will save this to MongoDB here.
  // For now, we just send a success response back to the frontend.
  res.status(200).json({ message: 'Booking successful!' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});