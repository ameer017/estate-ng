import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import agentsRouter from './routes/agents';
import walletsRouter from './routes/wallets';
import transactionsRouter from './routes/transactions';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/agents', agentsRouter);
app.use('/wallets', walletsRouter);
app.use('/transactions', transactionsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function main() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`AgentGuard API running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
