import './AppointmentCard.css'

const AppointmentCard = ({ appointment, showActions = false, onApprove, onReject }) => {
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'status-approved'
      case 'rejected':
        return 'status-rejected'
      case 'pending':
        return 'status-pending'
      default:
        return 'status-pending'
    }
  }

  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <h3 className="appointment-title">
          {appointment.patientName || appointment.doctorName || 'Appointment'}
        </h3>
        <span className={`status-badge ${getStatusClass(appointment.status)}`}>
          {appointment.status || 'Pending'}
        </span>
      </div>
      <div className="appointment-details">
        <div className="detail-item">
          <span className="detail-label">Department:</span>
          <span className="detail-value">{appointment.department || 'N/A'}</span>
        </div>
        {appointment.doctorName && (
          <div className="detail-item">
            <span className="detail-label">Doctor:</span>
            <span className="detail-value">{appointment.doctorName}</span>
          </div>
        )}
        {appointment.patientName && (
          <div className="detail-item">
            <span className="detail-label">Patient:</span>
            <span className="detail-value">{appointment.patientName}</span>
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">Date:</span>
          <span className="detail-value">
            {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Time:</span>
          <span className="detail-value">{appointment.timeSlot || 'N/A'}</span>
        </div>
      </div>
      {showActions && appointment.status === 'pending' && (
        <div className="appointment-actions">
          <button
            onClick={() => onApprove(appointment._id)}
            className="btn-approve"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(appointment._id)}
            className="btn-reject"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  )
}

export default AppointmentCard
