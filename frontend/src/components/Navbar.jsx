import React from 'react';
import {
  LogoIcon,
  RefreshIcon,
  SeedIcon,
  OverviewIcon,
  CombinedIcon,
  StudentIcon,
  CourseIcon
} from './Icons';

export default function Navbar({
  studentStatus,
  courseStatus,
  onRefresh,
  onSeedData,
  isRefreshing,
  activeTab,
  setActiveTab,
  studentCount,
  courseCount,
  combinedCount
}) {
  return (
    <header className="header-glass">
      <div className="header-top">
        <div className="brand-section">
          <div className="logo-badge">
            <LogoIcon size={26} color="#ffffff" />
          </div>
          <div>
            <h1 className="brand-title">EduFlow Microservices</h1>
            <div className="brand-subtitle">
              <span>MERN Distributed Architecture</span>
              <span className="badge-tag">REST Gateway</span>
            </div>
          </div>
        </div>

        <div className="service-status-bar">
          <div className="service-pill" title="Port 5001">
            <span className={`service-dot ${studentStatus === 'UP' ? 'online' : 'offline'}`}></span>
            <span>Student Service</span>
            <code style={{ fontSize: '0.75rem', color: '#818cf8' }}>:5001</code>
          </div>

          <div className="service-pill" title="Port 5002">
            <span className={`service-dot ${courseStatus === 'UP' ? 'online' : 'offline'}`}></span>
            <span>Course Service</span>
            <code style={{ fontSize: '0.75rem', color: '#c084fc' }}>:5002</code>
          </div>

          <div className="header-actions">
            <button
              className="btn btn-secondary btn-sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh all data"
            >
              <RefreshIcon size={14} className={isRefreshing ? 'spin-anim' : ''} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={onSeedData}
              title="Add sample courses and students for testing"
            >
              <SeedIcon size={14} />
              <span>Populate Demo Data</span>
            </button>
          </div>
        </div>
      </div>

      <nav className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <OverviewIcon size={16} />
          <span>Overview</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'combined' ? 'active' : ''}`}
          onClick={() => setActiveTab('combined')}
        >
          <CombinedIcon size={16} />
          <span>Combined View</span>
          <span className="tab-badge">{combinedCount}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <StudentIcon size={16} />
          <span>Students</span>
          <span className="tab-badge">{studentCount}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <CourseIcon size={16} />
          <span>Courses</span>
          <span className="tab-badge">{courseCount}</span>
        </button>
      </nav>
    </header>
  );
}
