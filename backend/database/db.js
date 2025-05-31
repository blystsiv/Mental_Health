import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URL;
  if (!uri) {
    console.error('❌ MONGODB_URL is not defined in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Error connecting to the database:', error.message);
    process.exit(1);
  }
};

export default connectDB;
