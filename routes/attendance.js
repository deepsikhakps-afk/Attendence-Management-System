const express = require('express');
const Attendance = require('../models/Attendance');
const router = express.Router();

// Role-based access: the client sends x-role: teacher | student
const teacherOnly = (req, res, next) =>
  req.get('x-role') === 'teacher' ? next() : res.status(403).json({ message: 'Only teachers can do this.' });

const wrap = fn => (req, res, next) => fn(req, res).catch(next);
const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const summarize = records => {
  const total = records.length;
  const present = records.filter(r => r.status === 'Present').length;
  return { total, present, absent: total - present, percentage: total ? Math.round((present / total) * 100) : 0 };
};

// CREATE  - teacher marks attendance
router.post('/', teacherOnly, wrap(async (req, res) => {
  const record = await Attendance.create(req.body);
  res.status(201).json(record);
}));

// READ    - teacher lists all records (filters: course, date, status, studentId, q)
router.get('/', teacherOnly, wrap(async (req, res) => {
  const { course, date, status, studentId, q } = req.query;
  const filter = {};
  if (course) filter.course = new RegExp(escapeRegex(course.trim()), 'i');
  if (date) filter.date = date;
  if (status) filter.status = status;
  if (studentId) filter.studentId = studentId.toUpperCase();
  if (q) filter.$or = [{ studentName: new RegExp(escapeRegex(q), 'i') }, { studentId: new RegExp(escapeRegex(q), 'i') }];
  const records = await Attendance.find(filter).sort({ date: -1, createdAt: -1 });
  res.json({ summary: summarize(records), records });
}));

// READ    - student views only their own attendance
router.get('/student/:studentId', wrap(async (req, res) => {
  const records = await Attendance.find({ studentId: req.params.studentId.toUpperCase() }).sort({ date: -1 });
  const byCourse = {};
  records.forEach(r => (byCourse[r.course] = byCourse[r.course] || []).push(r));
  const courses = Object.entries(byCourse).map(([course, list]) => ({ course, ...summarize(list) }));
  res.json({ summary: summarize(records), courses, records });
}));

// UPDATE  - teacher edits a record
router.put('/:id', teacherOnly, wrap(async (req, res) => {
  const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!record) return res.status(404).json({ message: 'Record not found.' });
  res.json(record);
}));

// DELETE  - teacher removes a record
router.delete('/:id', teacherOnly, wrap(async (req, res) => {
  const record = await Attendance.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ message: 'Record not found.' });
  res.json({ message: 'Record deleted.' });
}));

module.exports = router;
