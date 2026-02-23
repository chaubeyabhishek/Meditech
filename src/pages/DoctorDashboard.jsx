import { useState, useEffect } from 'react'
import { getAppointments, updateAppointmentStatus } from '../services/appointmentService'
import { getCurrentUser } from '../services/authService'
import AppointmentCard from '../components/AppointmentCard'
import Loader from '../components/Loader'
import './DoctorDashboard.css'

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(null)
  const user = getCurrentUser()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await getAppointments()
      // Filter appointments for current doctor if needed
      const allAppointments = response.appointments || response || []
      // In a real app, you'd filter by doctor ID from backend
      setAppointments(allAppointments)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (appointmentId) => {
    try {
      setUpdating(appointmentId)
      await updateAppointmentStatus(appointmentId, 'approved')
      // Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: 'approved' } : apt
        )
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve appointment')
    } finally {
      setUpdating(null)
    }
  }

  const handleReject = async (appointmentId) => {
    try {
      setUpdating(appointmentId)
      await updateAppointmentStatus(appointmentId, 'rejected')
      // Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: 'rejected' } : apt
        )
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject appointment')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Doctor Dashboard</h1>
            <p className="dashboard-subtitle">Welcome, Dr. {user.name}</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="appointments-section">
          <h2 className="section-title">Appointment Requests</h2>
          {appointments.length === 0 ? (
            <div className="empty-state">
              <p>No appointments found.</p>
            </div>
          ) : (
            <div className="appointments-grid">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  showActions={true}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
