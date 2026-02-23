import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAppointment } from '../services/appointmentService'
import { getDoctors } from '../services/doctorService'
import Loader from '../components/Loader'
import './BookAppointment.css'

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([])
  const [formData, setFormData] = useState({
    department: '',
    doctorId: '',
    date: '',
    timeSlot: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const fetchDoctors = async () => {
    setLoadingDoctors(true)
    setError('')
    try {
      const res = await getDoctors()
      setDoctors(res.doctors || [])
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      const isNetwork = !err.response
      setError(
        isNetwork
          ? 'Could not reach server. Make sure backend is running (npm run dev in backend folder, port 5000).'
          : msg || 'Failed to load doctors list.'
      )
    } finally {
      setLoadingDoctors(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Oncology',
    'General Medicine',
  ]

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        doctorName: doctors.find((d) => d._id === formData.doctorId)?.name || '',
      }
      await createAppointment(payload)
      setSuccess(true)
      setTimeout(() => {
        navigate('/patient-dashboard')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader />
  }


  return (
    <div className="book-appointment">
      <div className="book-container">
        <div className="book-header">
          <h1 className="book-title">Book Appointment</h1>
          <p className="book-subtitle">Schedule your medical appointment</p>
        </div>

        {success && (
          <div className="success-message">
            Appointment booked successfully! Redirecting to dashboard...
          </div>
        )}

        <div className="book-card">
          <form onSubmit={handleSubmit} className="book-form">
            {error && (
              <div className="error-message">
                {error}
                <button type="button" onClick={fetchDoctors} className="retry-btn">
                  Retry
                </button>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="doctorId">Select Doctor</label>
              {loadingDoctors ? (
                <p className="form-hint">Loading doctors...</p>
              ) : (
                <>
                  <select
                    id="doctorId"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                  {doctors.length === 0 && !error && (
                    <p className="form-hint">No doctors registered yet. Register as Doctor first, then book.</p>
                  )}
                </>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="timeSlot">Time Slot</label>
              <select
                id="timeSlot"
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select Time Slot</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/patient-dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || success}
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
