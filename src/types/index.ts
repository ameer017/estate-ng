export type PolicyTemplateType = 'treasury' | 'subscription' | 'marketplace';

export type TxRequestStatus = 'pending' | 'approved' | 'rejected' | 'executed';

export interface TransactionRequestPayload {
  walletId: string;
  to: string;
  tokenAddress?: string | null;
  amount: string;
  data?: string;
}

export interface PolicyEvaluationResult {
  allowed: boolean;
  reason?: string;
}
