const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance_db';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/attendance', require('./routes/attendance'));

// Central error handler
app.use((err, req, res, next) => {
  if (err.code === 11000)
    return res.status(409).json({ message: 'Attendance already marked for this student, course and date.' });
  if (err.name === 'ValidationError')
    return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
  if (err.name === 'CastError')
    return res.status(400).json({ message: 'Invalid ID format.' });
  console.error(err);
  res.status(500).json({ message: 'Server error.' });
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
