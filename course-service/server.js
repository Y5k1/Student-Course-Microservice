const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const courseRoutes = require('./routes/courseRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/courses', courseRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'Course Service',
    status: 'UP',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Database connection & Server start
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/course_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB (Course DB)');
    app.listen(PORT, () => {
      console.log(`Course Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
    app.listen(PORT, () => {
      console.log(`Course Service running without DB on port ${PORT}`);
    });
  });
