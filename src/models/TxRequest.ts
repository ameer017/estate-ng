import mongoose, { Document, Schema } from 'mongoose';
import { TxRequestStatus } from '../types';

export interface ITxRequest extends Document {
  agentId: mongoose.Types.ObjectId;
  walletId: mongoose.Types.ObjectId;
  to: string;
  tokenAddress: string | null;
  amount: string;
  data?: string;
  status: TxRequestStatus;
  rejectionReason?: string;
  createdAt: Date;
}

const TxRequestSchema = new Schema<ITxRequest>(
  {
    agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    to: { type: String, required: true },
    tokenAddress: { type: String, default: null },
    amount: { type: String, required: true },
    data: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'executed'],
      default: 'pending',
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

TxRequestSchema.index({ agentId: 1 });
TxRequestSchema.index({ walletId: 1 });
TxRequestSchema.index({ status: 1 });

export const TxRequest = mongoose.model<ITxRequest>('TxRequest', TxRequestSchema);
