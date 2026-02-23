const mongoose = require('mongoose');
const User = require('../models/User');

const getDoctors = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: 'Database not connected. Add MONGO_URI in backend .env and restart.',
      });
    }
    const doctors = await User.find({ role: 'doctor' })
      .select('_id name')
      .sort({ name: 1 })
      .lean();
    res.status(200).json({ doctors });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch doctors' });
  }
};

module.exports = { getDoctors };
