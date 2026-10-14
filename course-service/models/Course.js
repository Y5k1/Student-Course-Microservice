const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: [true, 'Course ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  courseName: {
    type: String,
    required: [true, 'Course Name is required'],
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Course Credits are required'],
    default: 3,
    min: [1, 'Credits must be at least 1']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
