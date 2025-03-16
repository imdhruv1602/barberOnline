const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');  // Import Twilio
const { loginUser, signupUser } = require('./routes/auth');
const Appointment = require('./models/appointmentModel'); // Import the Appointment model

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.set('bufferCommands', false);

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit the application if MongoDB connection fails
  }
}

// Initialize connection before setting up the routes
connectToDatabase().then(() => {
  // Authentication Routes
  // Login Route
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await loginUser(email, password);
      res.status(result.status).json({ message: result.message, user: result.user });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error during login' });
    }
  });

  // Signup Route
  app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const result = await signupUser(name, email, password);
      res.status(result.status).json({ message: result.message, user: result.user });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Server error during signup' });
    }
  });

  //appointment route
  app.post('/submit-appointment', async (req, res) => {
    const { name, phone, service, date, time } = req.body; // Removed 'email' from here
  
    try {
      // Save the appointment to the database
      const newAppointment = new Appointment({ name, phone, service, date, time });
      await newAppointment.save();
  
      // Send SMS using Twilio
      const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  
      const smsMessage = `Hi ${name}, your ${service} appointment is confirmed for ${date} at ${time}. See you soon!`;
  
      await twilioClient.messages.create({
        body: smsMessage,
        messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
        to: phone // Ensure the phone number includes the country code (e.g., +1234567890)
      });
  
      console.log('SMS sent successfully!');
  
      // Respond to the client
      res.status(200).json({
        message: 'Appointment successfully booked and SMS sent!',
        appointment: newAppointment
      });
  
    } catch (err) {
      console.error('Error booking appointment:', err);
      res.status(500).json({ message: 'Error booking the appointment' });
    }
  });
  

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
