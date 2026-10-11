/**
 * Genz chitchat — Server Entry Point
 * Express + Socket.IO server with security middleware,
 * rate limiting, and real-time chat/matchmaking.
 */
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { setupSocketHandlers } from './socket/index';
import healthRouter from './routes/health';
import reportsRouter from './routes/reports';
import paymentRouter from './routes/payment';
import { verifyEmailConfig } from './services/email';

const app = express();
const httpServer = createServer(app);

// ---- Security middleware ----
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());

// ---- Rate limiting ----
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ---- Routes ----
app.use('/api', healthRouter);
app.use('/api', reportsRouter);
app.use('/api', paymentRouter);

// ---- Socket.IO ----
const io = new Server(httpServer, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

setupSocketHandlers(io);

// ---- Start server ----
httpServer.listen(env.PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   🚀 Genz chitchat Server           ║
  ║   Port: ${env.PORT}                        ║
  ║   Mode: ${env.NODE_ENV.padEnd(22)}║
  ║   CORS: ${env.CORS_ORIGIN.padEnd(22).slice(0, 22)}║
  ╚══════════════════════════════════════╝
  `);

  // Verify SMTP config at startup
  verifyEmailConfig().catch((err) => {
    console.error('[Email Service] Startup verification error:', err);
  });
});

export { app, httpServer, io };
