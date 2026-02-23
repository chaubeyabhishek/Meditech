const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const uri = process.env.MONGO_URI && process.env.MONGO_URI.trim();
  if (!uri) {
    console.warn('MONGO_URI is empty. Add your MongoDB URL in .env file.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = conn.connections[0].readyState;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
