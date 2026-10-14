import React, { useState } from 'react';
import { CombinedIcon, StudentIcon, AlertIcon } from './Icons';

export default function CombinedView({ combinedStudents, loading, studentServiceUrl }) {
  const [showJson, setShowJson] = useState(false);

  return (
    <div>
      <div className="combined-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CombinedIcon size={22} color="#06b6d4" />
              <span>Live Microservice REST Aggregation</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Displaying student records enriched with course metadata fetched synchronously by <strong>Student Service</strong> calling <strong>Course Service</strong> via REST.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className="rest-tag">
              GET /api/students/combined
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowJson(!showJson)}
            >
              {showJson ? 'Hide JSON Payload' : '{ } View REST JSON'}
            </button>
          </div>
        </div>

        {showJson && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
              Synchronous REST Response from <code>{studentServiceUrl}/api/students/combined</code>:
            </div>
            <pre className="code-block" style={{ maxHeight: '250px' }}>
              {JSON.stringify(combinedStudents, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="glass-card">
        <div className="card-header">
          <h3 className="card-title">
            <span className="card-title-icon">
              <StudentIcon size={18} color="#818cf8" />
            </span>
            Combined Student–Course Roster ({combinedStudents.length})
          </h3>
          <span className="badge-tag" style={{ borderColor: 'rgba(6, 182, 212, 0.4)', color: '#22d3ee' }}>
            Inter-Service REST Call
          </span>
        </div>

        {loading ? (
          <div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
          </div>
        ) : combinedStudents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" style={{ display: 'flex', justifyContent: 'center' }}>
              <CombinedIcon size={42} color="#475569" />
            </div>
            <h3 style={{ marginTop: '0.75rem', fontWeight: 600 }}>No Enrolled Students Found</h3>
            <p>Add courses and students to see the live combined microservice view.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Details</th>
                  <th>Course ID</th>
                  <th>Course Details (from Course Service)</th>
                  <th>Credits</th>
                  <th>Service Status</th>
                </tr>
              </thead>
              <tbody>
                {combinedStudents.map((item) => {
                  const hasValidCourse = item.course && !item.course.isUnavailable;
                  return (
                    <tr key={item._id || item.studentId}>
                      <td>
                        <span className="table-code">{item.studentId}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.email}</div>
                      </td>
                      <td>
                        <span className="badge-tag" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                          {item.courseId}
                        </span>
                      </td>
                      <td>
                        {hasValidCourse ? (
                          <div>
                            <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                              {item.course.courseName}
                            </div>
                            {item.course.description && (
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {item.course.description}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fca5a5', fontSize: '0.85rem' }}>
                            <AlertIcon size={14} color="#fca5a5" />
                            <span>Course details unavailable in Course Service</span>
                          </div>
                        )}
                      </td>
                      <td>
                        {hasValidCourse ? (
                          <span className="credits-pill">
                            {item.course.credits} Credits
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-dim)' }}>—</span>
                        )}
                      </td>
                      <td>
                        {hasValidCourse ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                            REST Enriched
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', fontSize: '0.8rem' }}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b' }}></span>
                            Unlinked
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
