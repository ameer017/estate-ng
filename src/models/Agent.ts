import mongoose, { Document, Schema } from 'mongoose';

export interface IAgent extends Document {
  name: string;
  apiKeyHash: string;
  createdAt: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true },
    apiKeyHash: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Agent = mongoose.model<IAgent>('Agent', AgentSchema);
