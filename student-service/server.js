const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'Student Service',
    status: 'UP',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    courseServiceUrl: process.env.COURSE_SERVICE_URL || 'http://localhost:5002',
    timestamp: new Date().toISOString()
  });
});

// Database connection & Server start
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB (Student DB)');
    app.listen(PORT, () => {
      console.log(`Student Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
    app.listen(PORT, () => {
      console.log(`Student Service running without DB on port ${PORT}`);
    });
  });
