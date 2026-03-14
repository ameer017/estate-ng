import { PolicyEvaluationResult } from '../types';
import { IPolicy } from '../models/Policy';

/**
 * M1: Synchronous policy checks only (no chain / daily spend yet).
 * M2 will add daily spend from ActivityLog and simulation.
 */
export function evaluatePolicy(
  policy: IPolicy,
  params: { to: string; tokenAddress: string | null; amount: string }
): PolicyEvaluationResult {
  const amount = BigInt(params.amount);
  const perTxLimit = BigInt(policy.perTxLimit);

  if (amount <= 0n) {
    return { allowed: false, reason: 'Amount must be positive' };
  }

  if (amount > perTxLimit) {
    return { allowed: false, reason: `Amount exceeds per-transaction limit (${policy.perTxLimit})` };
  }

  // Native transfer: `to` must be in allowedContracts (or we treat as recipient allowlist).
  // For M1 we use allowedContracts as "allowed recipient addresses" for native; for tokens, contract is the token.
  if (params.tokenAddress) {
    const allowed = policy.allowedTokens.map((a) => a.toLowerCase());
    if (!allowed.includes(params.tokenAddress.toLowerCase())) {
      return { allowed: false, reason: 'Token not in allowlist' };
    }
  }

  const allowedRecipients = policy.allowedContracts.map((a) => a.toLowerCase());
  if (allowedRecipients.length > 0 && !allowedRecipients.includes(params.to.toLowerCase())) {
    return { allowed: false, reason: 'Recipient/contract not in allowlist' };
  }

  return { allowed: true };
}
