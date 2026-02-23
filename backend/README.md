# MediTrack Backend

Node.js + Express + MongoDB backend for MediTrack.

## Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Database URL**
   - Open `backend/.env`
   - `MONGO_URI=` ke baad apna MongoDB connection URL paste karo  
   - Example: `MONGO_URI=mongodb://localhost:27017/meditrack`  
   - Ya MongoDB Atlas: `MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/meditrack`

3. **Run server**
   ```bash
   npm run dev
   ```
   Server chalega on `http://localhost:5000`

## APIs

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/appointments` - Get appointments (auth required)
- `POST /api/appointments` - Book appointment (patient only)
- `PUT /api/appointments/:id` - Update status (doctor only)

Health check: `GET /api/health`
