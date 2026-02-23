const express = require('express');
const {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, checkRole } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAppointments);

router.post('/', checkRole('patient'), createAppointment);

router.put('/:id', checkRole('doctor'), updateAppointmentStatus);

module.exports = router;
