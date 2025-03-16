const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  email: {   // This is now optional
    type: String,
    required: false  // Setting `required: false` makes it optional
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
