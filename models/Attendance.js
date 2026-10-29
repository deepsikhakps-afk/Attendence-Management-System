const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId:   { type: String, required: [true, 'Student ID is required'], trim: true, uppercase: true },
  studentName: { type: String, required: [true, 'Student name is required'], trim: true },
  course:      { type: String, required: [true, 'Course is required'], trim: true },
  date:        { type: String, required: [true, 'Date is required'], match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'] },
  status:      { type: String, enum: { values: ['Present', 'Absent'], message: 'Status must be Present or Absent' }, required: true },
  teacher:     { type: String, required: [true, 'Teacher name is required'], trim: true }
}, { timestamps: true });

// One record per student, per course, per day
attendanceSchema.index({ studentId: 1, course: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
