import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import { connectToMongoDB } from './config/db.config.js';

import authRoutes from './routes/auth.routes.js';

// PORT initializaiton
const PORT = process.env.PORT || 5000;

// App initialization
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'GET', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieparser());

app.get('/hello', (req, res) => {
  res.send('Hello World');
});

// API routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server started at PORT: ${PORT}`);
});
