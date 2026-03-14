import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  agentId: mongoose.Types.ObjectId;
  address: string;
  createdAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    agentId: { type: Schema.Types.ObjectId, ref: 'Agent', required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

WalletSchema.index({ agentId: 1 });

export const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);
