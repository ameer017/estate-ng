import { Router, Request, Response } from 'express';
import { Wallet } from '../models/Wallet';
import { Policy } from '../models/Policy';
import { requireAgentAuth } from '../middleware/auth';
import { buildPolicyFromTemplate } from '../services/policyTemplates';
import { PolicyTemplateType } from '../types';
import mongoose from 'mongoose';

const router = Router();

router.use(requireAgentAuth);

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = req.agentId!;
    const { address, policyTemplateType, policyOverrides } = req.body as {
      address?: string;
      policyTemplateType?: PolicyTemplateType;
      policyOverrides?: {
        maxDailySpend?: string;
        perTxLimit?: string;
        allowedTokens?: string[];
        allowedContracts?: string[];
      };
    };
    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Wallet address is required' });
      return;
    }
    const template: PolicyTemplateType =
      policyTemplateType && ['treasury', 'subscription', 'marketplace'].includes(policyTemplateType)
        ? policyTemplateType
        : 'subscription';
    const policyParams = buildPolicyFromTemplate(template, policyOverrides);

    const wallet = await Wallet.create({
      agentId: new mongoose.Types.ObjectId(agentId),
      address: address.trim(),
    });
    await Policy.create({
      walletId: wallet._id,
      maxDailySpend: policyParams.maxDailySpend,
      perTxLimit: policyParams.perTxLimit,
      allowedTokens: policyParams.allowedTokens ?? [],
      allowedContracts: policyParams.allowedContracts ?? [],
      policyTemplateType: template,
    });
    const policy = await Policy.findOne({ walletId: wallet._id });
    res.status(201).json({
      walletId: wallet._id.toString(),
      agentId: wallet.agentId.toString(),
      address: wallet.address,
      policy: policy
        ? {
            maxDailySpend: policy.maxDailySpend,
            perTxLimit: policy.perTxLimit,
            allowedTokens: policy.allowedTokens,
            allowedContracts: policy.allowedContracts,
            policyTemplateType: policy.policyTemplateType,
          }
        : null,
      createdAt: wallet.createdAt,
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

router.put('/:walletId/policy', async (req: Request, res: Response): Promise<void> => {
  try {
    const agentId = req.agentId!;
    const { walletId } = req.params;
    const updates = req.body as {
      maxDailySpend?: string;
      perTxLimit?: string;
      allowedTokens?: string[];
      allowedContracts?: string[];
    };
    const wallet = await Wallet.findOne({
      _id: walletId,
      agentId: new mongoose.Types.ObjectId(agentId),
    });
    if (!wallet) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }
    const policy = await Policy.findOneAndUpdate(
      { walletId: wallet._id },
      {
        ...(updates.maxDailySpend !== undefined && { maxDailySpend: updates.maxDailySpend }),
        ...(updates.perTxLimit !== undefined && { perTxLimit: updates.perTxLimit }),
        ...(updates.allowedTokens !== undefined && { allowedTokens: updates.allowedTokens }),
        ...(updates.allowedContracts !== undefined && { allowedContracts: updates.allowedContracts }),
      },
      { new: true }
    );
    if (!policy) {
      res.status(404).json({ error: 'Policy not found' });
      return;
    }
    res.json({
      walletId: wallet._id.toString(),
      policy: {
        maxDailySpend: policy.maxDailySpend,
        perTxLimit: policy.perTxLimit,
        allowedTokens: policy.allowedTokens,
        allowedContracts: policy.allowedContracts,
        policyTemplateType: policy.policyTemplateType,
      },
    });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
