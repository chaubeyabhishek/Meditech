const Appointment = require('../models/Appointment');
const User = require('../models/User');

const getAppointments = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let filter = {};
    if (role === 'patient') {
      filter.patientId = _id;
    }
    if (role === 'doctor') {
      filter.doctorId = _id;
    }
    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch appointments' });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { department, doctorId, doctorName, date, timeSlot } = req.body;
    if (!department || !date || !timeSlot) {
      return res.status(400).json({
        message: 'Department, date and time slot are required',
      });
    }
    const patientId = req.user._id;
    const patientName = req.user.name;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime()) || parsedDate < new Date()) {
      return res.status(400).json({ message: 'Invalid or past date' });
    }
    let finalDoctorId = null;
    let finalDoctorName = doctorName || '';
    if (doctorId) {
      const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
      if (!doctor) {
        return res.status(400).json({ message: 'Selected doctor not found' });
      }
      finalDoctorId = doctor._id;
      finalDoctorName = doctor.name;
    } else if (doctorName && doctorName.trim()) {
      const doctor = await User.findOne({
        name: { $regex: new RegExp(doctorName.trim(), 'i') },
        role: 'doctor',
      });
      finalDoctorId = doctor ? doctor._id : null;
      finalDoctorName = doctorName.trim();
    } else {
      return res.status(400).json({ message: 'Please select a doctor' });
    }
    const appointment = await Appointment.create({
      patientId,
      patientName,
      doctorId: finalDoctorId,
      doctorName: finalDoctorName,
      department,
      date: parsedDate,
      timeSlot,
      status: 'pending',
    });
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: {
        _id: appointment._id,
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        department: appointment.department,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        status: appointment.status,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        createdAt: appointment.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to book appointment' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    appointment.status = status;
    await appointment.save();
    res.status(200).json({
      message: 'Appointment status updated successfully',
      appointment: {
        _id: appointment._id,
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        department: appointment.department,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        status: appointment.status,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        updatedAt: appointment.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update appointment' });
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
};
