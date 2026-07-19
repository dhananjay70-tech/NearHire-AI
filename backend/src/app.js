import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { config } from './config/config.js';
import { healthCheck } from './controllers/healthController.js';
import apiRoutes from './routes/apiRoutes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());

// ─── Rate Limiting (global) ───────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.', errors: [] },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true,
}));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── Root Health Check ────────────────────────────────────────────────────────
// GET /health
app.get('/health', healthCheck);

// ─── API Routes ───────────────────────────────────────────────────────────────
// GET /api/health  |  POST /api/auth/*  |  …
app.use('/api', apiRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ─── Centralised Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

export default app;
