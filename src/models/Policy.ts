import mongoose, { Document, Schema } from 'mongoose';
import { PolicyTemplateType } from '../types';

export interface IPolicy extends Document {
  walletId: mongoose.Types.ObjectId;
  maxDailySpend: string;
  perTxLimit: string;
  allowedTokens: string[];
  allowedContracts: string[];
  policyTemplateType: PolicyTemplateType;
  createdAt: Date;
  updatedAt: Date;
}

const PolicySchema = new Schema<IPolicy>(
  {
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true, unique: true },
    maxDailySpend: { type: String, required: true, default: '0' },
    perTxLimit: { type: String, required: true, default: '0' },
    allowedTokens: { type: [String], default: [] },
    allowedContracts: { type: [String], default: [] },
    policyTemplateType: {
      type: String,
      enum: ['treasury', 'subscription', 'marketplace'],
      required: true,
    },
  },
  { timestamps: true }
);

PolicySchema.index({ walletId: 1 });

export const Policy = mongoose.model<IPolicy>('Policy', PolicySchema);
