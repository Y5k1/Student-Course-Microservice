const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');

// Helper to find course by MongoDB _id or custom courseId
const findCourseByIdentifier = async (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const course = await Course.findById(identifier);
    if (course) return course;
  }
  return await Course.findOne({
    courseId: { $regex: new RegExp(`^${identifier.trim()}$`, 'i') }
  });
};

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id - Get course by MongoDB _id or courseId
router.get('/:id', async (req, res) => {
  try {
    const course = await findCourseByIdentifier(req.params.id);
    if (!course) {
      return res.status(404).json({ error: `Course '${req.params.id}' not found` });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch course' });
  }
});

// POST /api/courses - Create new course
router.post('/', async (req, res) => {
  try {
    const { courseId, courseName, credits, description } = req.body;

    if (!courseId || !courseName) {
      return res.status(400).json({
        error: 'Both Course ID and Course Name are required'
      });
    }

    // Check if courseId already exists
    const existing = await Course.findOne({
      courseId: { $regex: new RegExp(`^${courseId.trim()}$`, 'i') }
    });
    if (existing) {
      return res.status(409).json({
        error: `Course ID '${courseId.toUpperCase().trim()}' already exists`
      });
    }

    const course = new Course({
      courseId: courseId.trim().toUpperCase(),
      courseName: courseName.trim(),
      credits: credits ? Number(credits) : 3,
      description: description ? description.trim() : ''
    });

    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create course' });
  }
});

// PUT /api/courses/:id - Update course
router.put('/:id', async (req, res) => {
  try {
    const course = await findCourseByIdentifier(req.params.id);
    if (!course) {
      return res.status(404).json({ error: `Course '${req.params.id}' not found` });
    }

    const { courseName, credits, description } = req.body;
    if (courseName) course.courseName = courseName.trim();
    if (credits !== undefined) course.credits = Number(credits);
    if (description !== undefined) course.description = description.trim();

    const updated = await course.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update course' });
  }
});

// DELETE /api/courses/:id - Delete course
router.delete('/:id', async (req, res) => {
  try {
    const course = await findCourseByIdentifier(req.params.id);
    if (!course) {
      return res.status(404).json({ error: `Course '${req.params.id}' not found` });
    }

    await Course.findByIdAndDelete(course._id);
    res.json({ message: `Course '${course.courseId}' deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to delete course' });
  }
});

module.exports = router;
