import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authService'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getCurrentUser()

  if (!user.token) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />
    } else if (user.role === 'patient') {
      return <Navigate to="/patient-dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
