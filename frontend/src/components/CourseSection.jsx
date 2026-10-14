import React, { useState } from 'react';
import { PlusIcon, CourseIcon, TrashIcon } from './Icons';

export default function CourseSection({
  courses,
  onAddCourse,
  onDeleteCourse,
  loading
}) {
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    credits: '3',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseId.trim() || !formData.courseName.trim() || !formData.credits) {
      return;
    }

    setSubmitting(true);
    const success = await onAddCourse({
      courseId: formData.courseId.trim().toUpperCase(),
      courseName: formData.courseName.trim(),
      credits: Number(formData.credits),
      description: formData.description.trim()
    });

    if (success) {
      setFormData({ courseId: '', courseName: '', credits: '3', description: '' });
    }
    setSubmitting(false);
  };

  return (
    <div className="management-grid">
      {/* Add Course Form */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="card-title-icon">
              <PlusIcon size={18} color="#c084fc" />
            </span>
            Add New Course
          </h2>
          <span className="badge-tag" style={{ borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }}>
            Service 5002
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Course ID <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. CS101, IT204"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              required
            />
            <div className="form-hint">Unique course identifier (e.g. CS101)</div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Course Name <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Distributed Systems & Cloud"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Credits <span className="req">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="12"
              className="form-input"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              required
            />
            <div className="form-hint">Academic credit weighting (typically 1-5)</div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Core microservices and cloud concepts"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? 'Saving Course...' : 'Register Course'}
          </button>
        </form>
      </div>

      {/* Courses List Table */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="card-title-icon">
              <CourseIcon size={18} color="#c084fc" />
            </span>
            Available Courses ({courses.length})
          </h2>
          <span className="tab-badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe' }}>
            MongoDB course_db
          </span>
        </div>

        {loading ? (
          <div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" style={{ display: 'flex', justifyContent: 'center' }}>
              <CourseIcon size={42} color="#475569" />
            </div>
            <h3 style={{ marginTop: '0.75rem', fontWeight: 600 }}>No Courses Available</h3>
            <p>Add your first course using the form on the left.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id || course.courseId}>
                    <td>
                      <span className="table-code" style={{ color: '#c084fc' }}>
                        {course.courseId}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{course.courseName}</td>
                    <td>
                      <span className="credits-pill">
                        {course.credits} Credits
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {course.description || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-danger-ghost"
                        onClick={() => onDeleteCourse(course._id || course.courseId, course.courseName)}
                        title="Delete Course"
                      >
                        <TrashIcon size={14} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
