import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Wallet } from '../models/Wallet';
import { Policy } from '../models/Policy';
import { TxRequest } from '../models/TxRequest';
import { requireAgentAuth } from '../middleware/auth';
import { evaluatePolicy } from '../services/policyEngine';
import { TransactionRequestPayload } from '../types';

const router = Router();

router.use(requireAgentAuth);

router.post('/request', async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = req.agentId!;
    const body = req.body as TransactionRequestPayload;
    const { walletId, to, tokenAddress, amount, data } = body;

    if (!walletId || !to || amount === undefined) {
      res.status(400).json({
        error: 'walletId, to, and amount are required',
      });
      return;
    }

    const wallet = await Wallet.findOne({
      _id: walletId,
      agentId: new mongoose.Types.ObjectId(agentId),
    });
    if (!wallet) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }

    const policy = await Policy.findOne({ walletId: wallet._id });
    if (!policy) {
      res.status(404).json({ error: 'Policy not found for this wallet' });
      return;
    }

    const result = evaluatePolicy(policy, {
      to,
      tokenAddress: tokenAddress ?? null,
      amount: String(amount),
    });

    const status = result.allowed ? 'approved' : 'rejected';
    const txRequest = await TxRequest.create({
      agentId: new mongoose.Types.ObjectId(agentId),
      walletId: wallet._id,
      to,
      tokenAddress: tokenAddress ?? null,
      amount: String(amount),
      data: data ?? undefined,
      status,
      rejectionReason: result.reason,
    });

    res.status(201).json({
      txRequestId: txRequest._id.toString(),
      status,
      ...(result.reason && { reason: result.reason }),
      createdAt: txRequest.createdAt,
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
