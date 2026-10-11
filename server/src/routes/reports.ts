import { Router, Request, Response } from 'express';
import { addReport, getReports, unbanUser } from '../services/moderation';
import { env } from '../config/env';

const router = Router();

/** Submit a report via REST (alternative to socket event) */
router.post('/reports', (req: Request, res: Response) => {
  const { reportedFingerprint, reporterFingerprint, reason } = req.body;

  if (!reportedFingerprint || !reporterFingerprint || !reason) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const result = addReport(
    reportedFingerprint,
    reporterFingerprint,
    reason,
    env.REPORTS_BEFORE_BAN,
    env.BAN_DURATION_HOURS
  );

  res.json({ success: true, banned: result.banned });
});

/** Admin: list all reports (Phase 4 will add proper auth) */
router.get('/admin/reports', (_req: Request, res: Response) => {
  const reports = getReports();
  res.json({ reports, total: reports.length });
});

/** Admin: unban a user */
router.post('/admin/unban', (req: Request, res: Response) => {
  const { fingerprint } = req.body;
  if (!fingerprint) {
    res.status(400).json({ error: 'Fingerprint required' });
    return;
  }
  const result = unbanUser(fingerprint);
  res.json({ success: result });
});

export default router;
