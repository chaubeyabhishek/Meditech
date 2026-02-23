import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAppointments } from '../services/appointmentService'
import { getCurrentUser } from '../services/authService'
import AppointmentCard from '../components/AppointmentCard'
import Loader from '../components/Loader'
import './PatientDashboard.css'

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const user = getCurrentUser()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await getAppointments()
      // Filter appointments for current patient if needed
      setAppointments(response.appointments || response || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="patient-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome, {user.name}!</h1>
            <p className="dashboard-subtitle">Manage your medical appointments</p>
          </div>
          <button
            onClick={() => navigate('/book-appointment')}
            className="btn-primary"
          >
            Book Appointment
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="appointments-section">
          <h2 className="section-title">My Appointments</h2>
          {appointments.length === 0 ? (
            <div className="empty-state">
              <p>No appointments found. Book your first appointment!</p>
            </div>
          ) : (
            <div className="appointments-grid">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
