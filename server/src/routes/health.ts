import { Router, Request, Response } from 'express';
import { getOnlineCount, getQueueSize } from '../services/matchmaker';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    online: getOnlineCount(),
    queueSize: getQueueSize(),
  });
});

export default router;
