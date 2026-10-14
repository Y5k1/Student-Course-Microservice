import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import StudentSection from './components/StudentSection';
import CourseSection from './components/CourseSection';
import CombinedView from './components/CombinedView';
import Toast from './components/Toast';

const STUDENT_SERVICE_URL = (import.meta.env.VITE_STUDENT_SERVICE_URL || 'http://localhost:5001').replace(/\/+$/, '');
const COURSE_SERVICE_URL = (import.meta.env.VITE_COURSE_SERVICE_URL || 'http://localhost:5002').replace(/\/+$/, '');

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [combinedStudents, setCombinedStudents] = useState([]);

  const [studentStatus, setStudentStatus] = useState('CHECKING');
  const [courseStatus, setCourseStatus] = useState('CHECKING');

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Notification Helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check health of both services
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${STUDENT_SERVICE_URL}/health`);
      setStudentStatus(res.ok ? 'UP' : 'OFFLINE');
    } catch {
      setStudentStatus('OFFLINE');
    }

    try {
      const res = await fetch(`${COURSE_SERVICE_URL}/health`);
      setCourseStatus(res.ok ? 'UP' : 'OFFLINE');
    } catch {
      setCourseStatus('OFFLINE');
    }
  }, []);

  // Fetch all data from both microservices
  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);

    await checkHealth();

    try {
      // Fetch courses from Course Service
      const coursesRes = await fetch(`${COURSE_SERVICE_URL}/api/courses`).catch(() => null);
      if (coursesRes && coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      }

      // Fetch students from Student Service
      const studentsRes = await fetch(`${STUDENT_SERVICE_URL}/api/students`).catch(() => null);
      if (studentsRes && studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }

      // Fetch combined data from Student Service (orchestrator REST call)
      const combinedRes = await fetch(`${STUDENT_SERVICE_URL}/api/students/combined`).catch(() => null);
      if (combinedRes && combinedRes.ok) {
        const combinedData = await combinedRes.json();
        setCombinedStudents(combinedData);
      }

      if (isManualRefresh) {
        addToast('Data refreshed successfully from both microservices', 'success');
      }
    } catch (err) {
      addToast('Error synchronizing data with services', 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [checkHealth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler: Add Student
  const handleAddStudent = async (studentPayload) => {
    try {
      const response = await fetch(`${STUDENT_SERVICE_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentPayload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add student');
      }

      addToast(`Student ${data.name} (${data.studentId}) registered successfully!`, 'success');
      await fetchData();
      return true;
    } catch (err) {
      addToast(err.message, 'error');
      return false;
    }
  };

  // Handler: Delete Student
  const handleDeleteStudent = async (id, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student "${studentName}"?`)) return;

    try {
      const response = await fetch(`${STUDENT_SERVICE_URL}/api/students/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete student');
      }

      addToast(data.message || 'Student deleted successfully', 'success');
      await fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Handler: Add Course
  const handleAddCourse = async (coursePayload) => {
    try {
      const response = await fetch(`${COURSE_SERVICE_URL}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coursePayload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add course');
      }

      addToast(`Course ${data.courseName} (${data.courseId}) created successfully!`, 'success');
      await fetchData();
      return true;
    } catch (err) {
      addToast(err.message, 'error');
      return false;
    }
  };

  // Handler: Delete Course
  const handleDeleteCourse = async (id, courseName) => {
    if (!window.confirm(`Are you sure you want to delete course "${courseName}"?`)) return;

    try {
      const response = await fetch(`${COURSE_SERVICE_URL}/api/courses/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete course');
      }

      addToast(data.message || 'Course deleted successfully', 'success');
      await fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Handler: Seed Sample Data
  const handleSeedData = async () => {
    try {
      addToast('Seeding demo courses and students...', 'info');

      // Sample courses
      const demoCourses = [
        { courseId: 'CS101', courseName: 'Full Stack Web Development', credits: 4, description: 'MERN stack, REST APIs, and microservices' },
        { courseId: 'CS202', courseName: 'Distributed Cloud Systems', credits: 3, description: 'Docker, Kubernetes, and serverless compute' },
        { courseId: 'CS303', courseName: 'Database Management Systems', credits: 4, description: 'Relational & NoSQL database paradigms' }
      ];

      for (const c of demoCourses) {
        await fetch(`${COURSE_SERVICE_URL}/api/courses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(c)
        }).catch(() => null);
      }

      // Sample students
      const demoStudents = [
        { studentId: 'STU101', name: 'Aarav Sharma', email: 'aarav.sharma@college.edu', courseId: 'CS101' },
        { studentId: 'STU102', name: 'Priya Patel', email: 'priya.patel@college.edu', courseId: 'CS202' },
        { studentId: 'STU103', name: 'Rohan Gupta', email: 'rohan.gupta@college.edu', courseId: 'CS101' },
        { studentId: 'STU104', name: 'Ananya Verma', email: 'ananya.verma@college.edu', courseId: 'CS303' }
      ];

      for (const s of demoStudents) {
        await fetch(`${STUDENT_SERVICE_URL}/api/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(s)
        }).catch(() => null);
      }

      await fetchData();
      addToast('Demo courses and students successfully seeded!', 'success');
    } catch (err) {
      addToast('Failed to seed demo data. Make sure both backends are running.', 'error');
    }
  };

  return (
    <div className="app-container">
      <Navbar
        studentStatus={studentStatus}
        courseStatus={courseStatus}
        onRefresh={() => fetchData(true)}
        onSeedData={handleSeedData}
        isRefreshing={isRefreshing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentCount={students.length}
        courseCount={courses.length}
        combinedCount={combinedStudents.length}
      />

      <main>
        {activeTab === 'overview' && (
          <div>
            <StatsOverview
              students={students}
              courses={courses}
              combinedStudents={combinedStudents}
              studentStatus={studentStatus}
              courseStatus={courseStatus}
            />
            <CombinedView
              combinedStudents={combinedStudents}
              loading={loading}
              studentServiceUrl={STUDENT_SERVICE_URL}
            />
          </div>
        )}

        {activeTab === 'combined' && (
          <CombinedView
            combinedStudents={combinedStudents}
            loading={loading}
            studentServiceUrl={STUDENT_SERVICE_URL}
          />
        )}

        {activeTab === 'students' && (
          <StudentSection
            students={students}
            courses={courses}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            loading={loading}
          />
        )}

        {activeTab === 'courses' && (
          <CourseSection
            courses={courses}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            loading={loading}
          />
        )}
      </main>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
