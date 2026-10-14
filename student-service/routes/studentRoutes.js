const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const Student = require('../models/Student');

const rawCourseUrl = process.env.COURSE_SERVICE_URL || 'http://localhost:5002';
const COURSE_SERVICE_URL = rawCourseUrl.replace(/\/+$/, '');

// Helper to find student by MongoDB _id or custom studentId
const findStudentByIdentifier = async (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const student = await Student.findById(identifier);
    if (student) return student;
  }
  return await Student.findOne({
    studentId: { $regex: new RegExp(`^${identifier.trim()}$`, 'i') }
  });
};

// Helper function to call Course Service REST API
const fetchCourseDetails = async (courseId) => {
  if (!courseId) return null;
  try {
    const response = await axios.get(`${COURSE_SERVICE_URL}/api/courses/${encodeURIComponent(courseId)}`, {
      timeout: 3000
    });
    return response.data;
  } catch (error) {
    // If course not found (404) or course-service is offline, return descriptive fallback
    return {
      courseId: courseId,
      courseName: 'Course info unavailable',
      credits: '-',
      isUnavailable: true,
      error: error.response?.data?.error || error.message
    };
  }
};

// GET /api/students/combined - Microservice communication: Get all students with their course details
router.get('/combined', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    // Concurrently fetch course details for each student via Course Service REST API
    const combinedData = await Promise.all(
      students.map(async (student) => {
        const studentObj = student.toObject();
        const course = await fetchCourseDetails(student.courseId);
        return {
          ...studentObj,
          course: course || null
        };
      })
    );

    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch combined student-course data' });
  }
});

// GET /api/students/:id/combined - Get single student combined with course details
router.get('/:id/combined', async (req, res) => {
  try {
    const student = await findStudentByIdentifier(req.params.id);
    if (!student) {
      return res.status(404).json({ error: `Student '${req.params.id}' not found` });
    }

    const studentObj = student.toObject();
    const course = await fetchCourseDetails(student.courseId);

    res.json({
      ...studentObj,
      course: course || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch student details' });
  }
});

// GET /api/students - Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch students' });
  }
});

// GET /api/students/:id - Get student by MongoDB _id or studentId
router.get('/:id', async (req, res) => {
  try {
    const student = await findStudentByIdentifier(req.params.id);
    if (!student) {
      return res.status(404).json({ error: `Student '${req.params.id}' not found` });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch student' });
  }
});

// POST /api/students - Create new student
router.post('/', async (req, res) => {
  try {
    const { studentId, name, email, courseId } = req.body;

    if (!studentId || !name || !email || !courseId) {
      return res.status(400).json({
        error: 'Student ID, Name, Email, and Course ID are all required'
      });
    }

    // Check for existing studentId
    const existingId = await Student.findOne({
      studentId: { $regex: new RegExp(`^${studentId.trim()}$`, 'i') }
    });
    if (existingId) {
      return res.status(409).json({
        error: `Student ID '${studentId.trim()}' is already registered`
      });
    }

    // Check for existing email
    const existingEmail = await Student.findOne({
      email: email.trim().toLowerCase()
    });
    if (existingEmail) {
      return res.status(409).json({
        error: `Email '${email.trim()}' is already registered`
      });
    }

    const student = new Student({
      studentId: studentId.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      courseId: courseId.trim().toUpperCase()
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create student' });
  }
});

// PUT /api/students/:id - Update student
router.put('/:id', async (req, res) => {
  try {
    const student = await findStudentByIdentifier(req.params.id);
    if (!student) {
      return res.status(404).json({ error: `Student '${req.params.id}' not found` });
    }

    const { name, email, courseId } = req.body;
    if (name) student.name = name.trim();
    if (email) student.email = email.trim().toLowerCase();
    if (courseId) student.courseId = courseId.trim().toUpperCase();

    const updated = await student.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update student' });
  }
});

// DELETE /api/students/:id - Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await findStudentByIdentifier(req.params.id);
    if (!student) {
      return res.status(404).json({ error: `Student '${req.params.id}' not found` });
    }

    await Student.findByIdAndDelete(student._id);
    res.json({ message: `Student '${student.name}' (${student.studentId}) deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to delete student' });
  }
});

module.exports = router;
