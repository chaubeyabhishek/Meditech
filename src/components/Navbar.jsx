import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../services/authService'
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user.token) {
    return null
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏥</span>
          MediTrack
        </Link>
        <div className="navbar-menu">
          {user.role === 'patient' && (
            <>
              <Link to="/patient-dashboard" className="navbar-link">
                Dashboard
              </Link>
              <Link to="/book-appointment" className="navbar-link">
                Book Appointment
              </Link>
            </>
          )}
          {user.role === 'doctor' && (
            <Link to="/doctor-dashboard" className="navbar-link">
              Dashboard
            </Link>
          )}
          <span className="navbar-user">Welcome, {user.name}</span>
          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
