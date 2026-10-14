const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Student Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Student Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
  },
  courseId: {
    type: String,
    required: [true, 'Course ID is required'],
    trim: true,
    uppercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);
