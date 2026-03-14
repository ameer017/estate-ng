import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      agentId?: string;
    }
  }
}

export {};
