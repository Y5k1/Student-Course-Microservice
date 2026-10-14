# 🎓 Student–Course Management System (MERN Microservices)

A distributed full-stack MERN application demonstrating microservice architecture, synchronous inter-service REST communication, and an interactive React dashboard.

---

## 🏛️ Architecture Overview

```
                                      ┌────────────────────────┐
                                      │   React 18 Dashboard   │
                                      │  (Vite on Port 5173)   │
                                      └───────────┬────────────┘
                                                  │
                       ┌──────────────────────────┴──────────────────────────┐
                       │                                                     │
                       ▼                                                     ▼
           ┌────────────────────────┐                             ┌────────────────────┐
           │     Student Service    │  ── [REST: GET /courses/:id] ──▶ │   Course Service   │
           │  (Express on Port 5001)│                             │(Express Port 5002) │
           └───────────┬────────────┘                             └─────────┬──────────┘
                       │                                                    │
                       ▼                                                    ▼
             [(MongoDB student_db)]                               [(MongoDB course_db)]
```

### 1. Course Service (`:5002`)
- Manages course entities: **Course ID (`courseId`)**, **Course Name (`courseName`)**, **Credits (`credits`)**, and description.
- Independent Express API connected to MongoDB database `course_db`.

### 2. Student Service (`:5001`)
- Manages student records: **Student ID (`studentId`)**, **Name (`name`)**, **Email (`email`)**, and enrolled **Course ID (`courseId`)**.
- Acts as a microservice orchestrator: when queried for combined records (`/api/students/combined`), it calls `Course Service` synchronously via REST to enrich student data with full course metadata.
- Connected to MongoDB database `student_db`.

### 3. Frontend Dashboard (`:5173`)
- Modern, responsive SPA with dark glassmorphism styling.
- Live service health indicators (Port 5001 & Port 5002).
- Forms for creating students and courses with validation.
- Live Combined Microservice View with REST inspection.
- "Seed Demo Data" action to populate test data in one click.

---

## 🚀 Local Run Instructions

### Prerequisites
- **Node.js**: v18+ (verified on Node 25)
- **MongoDB**: Running locally on `mongodb://localhost:27017`

### 1. Start Course Service (Terminal 1)
```bash
cd course-service
npm install
npm run dev
# Or: node server.js (Runs on Port 5002)
```

### 2. Start Student Service (Terminal 2)
```bash
cd student-service
npm install
npm run dev
# Or: node server.js (Runs on Port 5001)
```

### 3. Start Frontend Dashboard (Terminal 3)
```bash
cd frontend
npm install
npm run dev
# Access UI at: http://localhost:5173
```

---

## 📡 REST API Reference

### Course Service (`http://localhost:5002`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check & DB connection status |
| `GET` | `/api/courses` | Retrieve all courses |
| `GET` | `/api/courses/:id` | Retrieve course by Course ID (e.g. `CS101`) or MongoDB `_id` |
| `POST` | `/api/courses` | Create new course (`{ courseId, courseName, credits, description }`) |
| `PUT` | `/api/courses/:id` | Update course details |
| `DELETE` | `/api/courses/:id` | Delete course |

### Student Service (`http://localhost:5001`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check & DB connection status |
| `GET` | `/api/students` | Retrieve all students |
| `GET` | `/api/students/:id` | Retrieve student by Student ID (e.g. `STU101`) or `_id` |
| `GET` | `/api/students/combined` | **Microservice Communication**: Returns students merged with course data fetched via REST from Course Service |
| `GET` | `/api/students/:id/combined` | Return single student merged with course details |
| `POST` | `/api/students` | Register student (`{ studentId, name, email, courseId }`) |
| `PUT` | `/api/students/:id` | Update student details |
| `DELETE` | `/api/students/:id` | Delete student |

---

## ☁️ Deployment Guide (Render & Vercel)

### Option A: 1-Click Render Blueprint (Recommended)

This repository includes a `render.yaml` Blueprint file for automatic configuration:

1. Push this repository to GitHub: `https://github.com/Y5k1/Student-Course-Microservice`.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **Blueprint**.
3. Connect `https://github.com/Y5k1/Student-Course-Microservice`.
4. Render will detect `render.yaml` and configure:
   - `course-service` (Web Service on Node)
   - `student-service` (Web Service on Node)
   - `student-course-frontend` (Static Site on Vite)
5. Fill in the prompted environment variables:
   - `MONGO_URI` for course-service (MongoDB Atlas URI for `course_db`)
   - `MONGO_URI` for student-service (MongoDB Atlas URI for `student_db`)
   - `COURSE_SERVICE_URL` for student-service (set to `https://course-service.onrender.com`)
   - `VITE_STUDENT_SERVICE_URL` and `VITE_COURSE_SERVICE_URL` for frontend
6. Click **Apply** to deploy all services together.

---

### Option B: Manual Service Deployment

1. **Course Service on Render:**
   - **Repository:** Connect your GitHub repository.
   - **Root Directory:** `course-service`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `PORT`: `5002` (or let Render set it dynamically)
     - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/course_db?retryWrites=true&w=majority`
   - Note the deployed URL (e.g. `https://course-service.onrender.com`).

2. **Student Service on Render:**
   - **Root Directory:** `student-service`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `PORT`: `5001`
     - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/student_db?retryWrites=true&w=majority`
     - `COURSE_SERVICE_URL`: `https://course-service.onrender.com` (URL from step 1)
   - Note the deployed URL (e.g. `https://student-service.onrender.com`).

### Deploying Frontend to Vercel

1. **Import Project into Vercel:**
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     - `VITE_STUDENT_SERVICE_URL`: `https://student-service.onrender.com`
     - `VITE_COURSE_SERVICE_URL`: `https://course-service.onrender.com`
