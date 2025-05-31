import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import userRoutes from './routes/index.js';
import connectDB from './database/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.set('strictQuery', true);
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  '/coverPicturs',
  express.static(path.join(__dirname, 'coverPicturs')),
);

// Routes
app.use('/', userRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
