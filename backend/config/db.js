const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI && process.env.MONGO_URI.trim();
  if (!uri) {
    console.warn('MONGO_URI is empty. Add your MongoDB URL in .env file.');
    return;
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
