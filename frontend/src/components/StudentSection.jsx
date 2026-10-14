import React, { useState } from 'react';
import { PlusIcon, StudentIcon, TrashIcon } from './Icons';

export default function StudentSection({
  students,
  courses,
  onAddStudent,
  onDeleteStudent,
  loading
}) {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    courseId: ''
  });
  const [customCourseInput, setCustomCourseInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId.trim() || !formData.name.trim() || !formData.email.trim() || !formData.courseId.trim()) {
      return;
    }

    setSubmitting(true);
    const success = await onAddStudent({
      studentId: formData.studentId.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      courseId: formData.courseId.trim().toUpperCase()
    });

    if (success) {
      setFormData({ studentId: '', name: '', email: '', courseId: '' });
      setCustomCourseInput(false);
    }
    setSubmitting(false);
  };

  return (
    <div className="management-grid">
      {/* Add Student Form */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="card-title-icon">
              <PlusIcon size={18} color="#818cf8" />
            </span>
            Add New Student
          </h2>
          <span className="badge-tag">Service 5001</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Student ID <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. STU101"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            />
            <div className="form-hint">Unique identifier for the student</div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Full Name <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Alice Johnson"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Email Address <span className="req">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. alice@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Enrolled Course ID <span className="req">*</span>
              </label>
              {courses.length > 0 && (
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setCustomCourseInput(!customCourseInput)}
                >
                  {customCourseInput ? 'Choose from list' : 'Type custom ID'}
                </button>
              )}
            </div>

            {courses.length > 0 && !customCourseInput ? (
              <select
                className="form-select"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                required
              >
                <option value="">-- Select an active course --</option>
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseId} - {course.courseName} ({course.credits} cr)
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CS101"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                required
              />
            )}
            <div className="form-hint">Linked to Course Service over REST</div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? 'Saving Student...' : 'Register Student'}
          </button>
        </form>
      </div>

      {/* Student List Table */}
      <div className="glass-card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="card-title-icon">
              <StudentIcon size={18} color="#818cf8" />
            </span>
            Registered Students ({students.length})
          </h2>
          <span className="tab-badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
            MongoDB student_db
          </span>
        </div>

        {loading ? (
          <div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" style={{ display: 'flex', justifyContent: 'center' }}>
              <StudentIcon size={42} color="#475569" />
            </div>
            <h3 style={{ marginTop: '0.75rem', fontWeight: 600 }}>No Students Registered</h3>
            <p>Use the registration form on the left or click Populate Demo Data above.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Enrolled Course</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id || student.studentId}>
                    <td>
                      <span className="table-code">{student.studentId}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{student.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{student.email}</td>
                    <td>
                      <span className="badge-tag" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                        {student.courseId}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-danger-ghost"
                        onClick={() => onDeleteStudent(student._id || student.studentId, student.name)}
                        title="Delete Student"
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
