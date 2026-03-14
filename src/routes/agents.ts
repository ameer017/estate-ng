import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { Agent } from '../models/Agent';
import { hashApiKey } from '../middleware/auth';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    const apiKey = crypto.randomBytes(32).toString('hex');
    const apiKeyHash = hashApiKey(apiKey);
    const agent = await Agent.create({ name, apiKeyHash });
    res.status(201).json({
      agentId: agent._id.toString(),
      name: agent.name,
      apiKey,
      createdAt: agent.createdAt,
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
