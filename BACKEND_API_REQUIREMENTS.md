# Backend API Requirements for MediTrack

Yeh document aapko batata hai ki backend mein kitni aur kaun si APIs banani hain.

## Total APIs Required: **5 APIs**

---

## 1. Authentication APIs (2 APIs)

### 1.1 POST `/api/auth/register`
**Purpose:** Naya user register karna

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient" // ya "doctor"
}
```

**Response (Success - 201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Email already exists"
}
```

**Requirements:**
- Password ko hash karna (bcrypt recommended)
- Email validation
- Duplicate email check
- Role validation (only "patient" or "doctor")

---

### 1.2 POST `/api/auth/login`
**Purpose:** User login karna

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "token": "jwt_token_here",
  "role": "patient",
  "name": "John Doe",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid email or password"
}
```

**Requirements:**
- JWT token generate karna
- Password verify karna
- Token expiry set karna (recommended: 24 hours)

---

## 2. Appointment APIs (3 APIs)

### 2.1 GET `/api/appointments`
**Purpose:** Sabhi appointments fetch karna

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (Success - 200):**
```json
{
  "appointments": [
    {
      "_id": "appointment_id_1",
      "patientName": "John Doe",
      "doctorName": "Dr. Smith",
      "department": "Cardiology",
      "date": "2024-02-25",
      "timeSlot": "10:00 AM",
      "status": "pending", // "pending", "approved", "rejected"
      "patientId": "patient_id_here",
      "doctorId": "doctor_id_here",
      "createdAt": "2024-02-20T10:00:00Z"
    },
    {
      "_id": "appointment_id_2",
      "patientName": "Jane Doe",
      "doctorName": "Dr. Johnson",
      "department": "Neurology",
      "date": "2024-02-26",
      "timeSlot": "02:00 PM",
      "status": "approved",
      "patientId": "patient_id_2",
      "doctorId": "doctor_id_2",
      "createdAt": "2024-02-20T11:00:00Z"
    }
  ]
}
```

**Requirements:**
- JWT token verify karna (middleware)
- Role-based filtering:
  - **Patient:** Sirf apne appointments dikhana
  - **Doctor:** Sabhi appointments dikhana (ya sirf unke assigned appointments)
- Token se user ID extract karna

---

### 2.2 POST `/api/appointments`
**Purpose:** Naya appointment book karna

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "department": "Cardiology",
  "doctorName": "Dr. Smith",
  "date": "2024-02-25",
  "timeSlot": "10:00 AM"
}
```

**Response (Success - 201):**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "appointment_id_here",
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "department": "Cardiology",
    "date": "2024-02-25",
    "timeSlot": "10:00 AM",
    "status": "pending",
    "patientId": "patient_id_from_token",
    "doctorId": "doctor_id_if_found",
    "createdAt": "2024-02-20T10:00:00Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Invalid date or time slot"
}
```

**Requirements:**
- JWT token verify karna
- Sirf "patient" role wale users book kar sakte hain
- Token se patient ID extract karna
- Date validation (past dates allow nahi karni)
- Doctor name se doctor ID find karna (optional)
- Default status: "pending"

---

### 2.3 PUT `/api/appointments/:id`
**Purpose:** Appointment status update karna (approve/reject)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**
- `id`: Appointment ID

**Request Body:**
```json
{
  "status": "approved" // ya "rejected"
}
```

**Response (Success - 200):**
```json
{
  "message": "Appointment status updated successfully",
  "appointment": {
    "_id": "appointment_id_here",
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "department": "Cardiology",
    "date": "2024-02-25",
    "timeSlot": "10:00 AM",
    "status": "approved",
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "updatedAt": "2024-02-20T11:00:00Z"
  }
}
```

**Response (Error - 403):**
```json
{
  "message": "Only doctors can update appointment status"
}
```

**Response (Error - 404):**
```json
{
  "message": "Appointment not found"
}
```

**Requirements:**
- JWT token verify karna
- Sirf "doctor" role wale users update kar sakte hain
- Appointment existence check
- Status validation ("approved" ya "rejected" only)
- Optional: Doctor ko sirf apne appointments update karne dena

---

## Database Schema Suggestions

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ("patient" | "doctor"),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointments Collection
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: Users),
  patientName: String,
  doctorId: ObjectId (ref: Users, optional),
  doctorName: String,
  department: String,
  date: Date,
  timeSlot: String,
  status: String ("pending" | "approved" | "rejected"),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Middleware Requirements

### 1. Authentication Middleware
- JWT token verify karna
- Token se user info extract karna
- `req.user` mein user data add karna

### 2. Role-based Authorization Middleware
- Check karna ki user ka role sahi hai
- Example: `checkRole(['doctor'])` for doctor-only routes

---

## Error Handling

Sabhi APIs mein consistent error format:

**Success:**
- 200: OK
- 201: Created

**Client Errors:**
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid token/credentials)
- 403: Forbidden (insufficient permissions)
- 404: Not Found

**Server Errors:**
- 500: Internal Server Error

**Error Response Format:**
```json
{
  "message": "Error message here",
  "error": "Detailed error (optional)"
}
```

---

## Security Requirements

1. **Password Hashing:** bcrypt use karna (minimum 10 rounds)
2. **JWT Secret:** Strong secret key use karna
3. **Token Expiry:** 24 hours recommended
4. **Input Validation:** 
   - Email format validation
   - Password strength (minimum 6 characters)
   - Date validation
5. **CORS:** Frontend URL ko allow karna
6. **Rate Limiting:** Login/Register APIs par rate limiting lagana

---

## Summary

**Total APIs: 5**
- ✅ POST `/api/auth/register`
- ✅ POST `/api/auth/login`
- ✅ GET `/api/appointments`
- ✅ POST `/api/appointments`
- ✅ PUT `/api/appointments/:id`

**Additional Requirements:**
- Authentication middleware
- Role-based authorization
- Database models (Users, Appointments)
- Error handling
- Input validation

Yeh sab APIs banane ke baad aapka frontend perfectly kaam karega! 🚀
