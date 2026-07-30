import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import taskRoutes from './routes/taskRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Security Headers Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Dynamic CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim().replace(/\/$/, ''))
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    const cleanOrigin = origin ? origin.replace(/\/$/, '') : null;
    if (
      !cleanOrigin ||
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(cleanOrigin) ||
      allowedOrigins.includes('*') ||
      cleanOrigin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error(`Access denied by CORS policy for origin: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// 3. Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});

app.use('/api', limiter);

// Body Parsing
app.use(express.json({ limit: '1mb' }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

// Catch-all for undefined 404 API routes
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Error Handling Middleware
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Task Management Express Server running in [${NODE_ENV}] mode on port ${PORT}`);
    if (allowedOrigins.length > 0) {
      console.log(`Restricted CORS origins: ${allowedOrigins.join(', ')}`);
    } else {
      console.log(`CORS allowed for all origins (Set CORS_ORIGIN in environment for production)`);
    }
  });
}

export default app;

