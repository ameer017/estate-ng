import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Agent } from '../models/Agent';

const API_KEY_HEADER = 'x-api-key';

export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

export async function requireAgentAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const rawKey = req.headers[API_KEY_HEADER] as string;
  if (!rawKey) {
    res.status(401).json({ error: 'Missing x-api-key header' });
    return;
  }
  const hash = hashApiKey(rawKey);
  const agent = await Agent.findOne({ apiKeyHash: hash });
  if (!agent) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }
  (req as Request & { agentId: string }).agentId = agent._id.toString();
  next();
}
