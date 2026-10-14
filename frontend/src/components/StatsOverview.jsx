import React from 'react';
import { StudentIcon, CourseIcon, CombinedIcon, AwardIcon } from './Icons';

export default function StatsOverview({ students, courses, combinedStudents }) {
  const totalCredits = combinedStudents.reduce((acc, curr) => {
    const cred = Number(curr.course?.credits);
    return acc + (isNaN(cred) ? 0 : cred);
  }, 0);

  const matchedEnrollments = combinedStudents.filter(s => s.course && !s.course.isUnavailable).length;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon indigo">
            <StudentIcon size={24} color="#818cf8" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Students</span>
            <span className="stat-value">{students.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <CourseIcon size={24} color="#c084fc" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Courses</span>
            <span className="stat-value">{courses.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon emerald">
            <CombinedIcon size={24} color="#34d399" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Enrollments</span>
            <span className="stat-value">{matchedEnrollments}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cyan">
            <AwardIcon size={24} color="#22d3ee" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Credits Enrolled</span>
            <span className="stat-value">{totalCredits}</span>
          </div>
        </div>
      </div>

      <div className="arch-banner">
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
            Microservices Communication Flow
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Student Service acts as orchestrator, querying Course Service over internal REST API.
          </div>
        </div>

        <div className="arch-flow">
          <div className="arch-node" style={{ borderColor: '#818cf8', color: '#818cf8' }}>
            React Frontend (:5173)
          </div>
          <span className="arch-arrow">→</span>
          <div className="arch-node" style={{ borderColor: '#6366f1', color: '#a5b4fc' }}>
            Student Service (:5001)
          </div>
          <span className="arch-arrow">→ REST →</span>
          <div className="arch-node" style={{ borderColor: '#c084fc', color: '#e9d5ff' }}>
            Course Service (:5002)
          </div>
        </div>
      </div>
    </div>
  );
}
