# Attendance Management Module (Node.js + Express + MongoDB)

## Setup
1. Install Node.js and start MongoDB (`mongod`).
2. In this folder run:  `npm install`  then  `npm start`
3. Open http://localhost:3000

Optional: set `MONGO_URI` / `PORT` environment variables.

## REST API (send header `x-role: teacher` for teacher-only routes)
| Method | Endpoint                          | Role    | Purpose                              |
|--------|-----------------------------------|---------|--------------------------------------|
| POST   | /api/attendance                   | Teacher | Mark attendance                      |
| GET    | /api/attendance?course=&date=&status=&q= | Teacher | List/filter records + summary |
| GET    | /api/attendance/student/:studentId| Student | View own records + per-course %      |
| PUT    | /api/attendance/:id               | Teacher | Update a record                      |
| DELETE | /api/attendance/:id               | Teacher | Delete a record                      |

## Postman sample (POST /api/attendance, header x-role: teacher)
{ "studentId": "25MCA1001", "studentName": "Aman Singh", "course": "Web Technologies",
  "date": "2026-10-29", "status": "Present", "teacher": "Dr. Sharma" }
