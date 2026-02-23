# MediTrack - Medical Appointment Management System

A modern, responsive frontend application for managing medical appointments built with React, Vite, and React Router.

## Features

- **Authentication System**
  - User login and registration
  - Role-based access (Patient/Doctor)
  - JWT token management

- **Patient Features**
  - View appointments dashboard
  - Book new appointments
  - Track appointment status

- **Doctor Features**
  - View all appointment requests
  - Approve or reject appointments
  - Real-time status updates

- **Modern UI/UX**
  - Professional hospital theme
  - Responsive design
  - Smooth animations and transitions
  - Clean, minimal interface

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **CSS Modules** - Styling

## Project Structure

```
MediTrack/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── AppointmentCard.jsx
│   │   ├── AppointmentCard.css
│   │   ├── ProtectedRoute.jsx
│   │   ├── Loader.jsx
│   │   └── Loader.css
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Register.jsx
│   │   ├── Register.css
│   │   ├── PatientDashboard.jsx
│   │   ├── PatientDashboard.css
│   │   ├── BookAppointment.jsx
│   │   ├── BookAppointment.css
│   │   ├── DoctorDashboard.jsx
│   │   └── DoctorDashboard.css
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── appointmentService.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup** (Optional)
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   If not set, defaults to `http://localhost:5000/api`

## Running the Application

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Preview Production Build**
   ```bash
   npm run preview
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

The frontend expects the following backend API endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment status

### Request/Response Format

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "token": "jwt_token_here",
  "role": "patient",
  "name": "User Name"
}
```

**Register Request:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "patient"
}
```

**Create Appointment Request:**
```json
{
  "department": "Cardiology",
  "doctorName": "Dr. Smith",
  "date": "2024-02-25",
  "timeSlot": "10:00 AM"
}
```

**Update Appointment Request:**
```json
{
  "status": "approved"
}
```

## Authentication

- JWT tokens are stored in `localStorage`
- Tokens are automatically attached to API requests via Axios interceptors
- Protected routes redirect to login if user is not authenticated
- Role-based routing ensures users only access their designated dashboards

## Routing

- `/` - Login page
- `/register` - Registration page
- `/patient-dashboard` - Patient dashboard (protected, patient only)
- `/book-appointment` - Book appointment page (protected, patient only)
- `/doctor-dashboard` - Doctor dashboard (protected, doctor only)

## Styling

- All components use separate CSS files (not inline styles)
- Professional hospital color palette (blue/purple gradients)
- Responsive design for mobile and desktop
- Modern UI with rounded corners, shadows, and smooth transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Ensure your backend API is running on `http://localhost:5000` (or update the proxy in `vite.config.js`)
- The application uses localStorage for token storage
- All API calls include authentication headers automatically
- Error handling is implemented for network failures and API errors

## Development

For development, the Vite dev server includes a proxy to forward `/api` requests to your backend server. Update the proxy target in `vite.config.js` if your backend runs on a different port.

## License

This project is created for educational purposes.
