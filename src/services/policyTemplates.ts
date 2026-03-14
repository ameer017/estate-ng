import { PolicyTemplateType } from '../types';

export interface TemplatePolicyParams {
  maxDailySpend: string;
  perTxLimit: string;
  allowedTokens: string[];
  allowedContracts: string[];
}

const TEMPLATES: Record<PolicyTemplateType, TemplatePolicyParams> = {
  treasury: {
    maxDailySpend: '1000',
    perTxLimit: '100',
    allowedTokens: [],
    allowedContracts: [],
  },
  subscription: {
    maxDailySpend: '50',
    perTxLimit: '20',
    allowedTokens: [],
    allowedContracts: [],
  },
  marketplace: {
    maxDailySpend: '200',
    perTxLimit: '50',
    allowedTokens: [],
    allowedContracts: [],
  },
};

export function getPolicyDefaults(template: PolicyTemplateType): TemplatePolicyParams {
  return { ...TEMPLATES[template] };
}

export function buildPolicyFromTemplate(
  template: PolicyTemplateType,
  overrides?: Partial<TemplatePolicyParams>
): TemplatePolicyParams {
  const base = getPolicyDefaults(template);
  return { ...base, ...overrides };
}
