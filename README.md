# AgentGuard

Secure wallet and permission infrastructure for autonomous agents on Celo (Sepolia).

## Milestone 1 — Agent Wallet & Policy Engine

- **POST /agents** — Create agent, returns `agentId` and one-time `apiKey`
- **POST /wallets** — Create wallet for agent (auth: `x-api-key`). Body: `address`, `policyTemplateType` (`treasury` | `subscription` | `marketplace`), optional `policyOverrides`
- **PUT /wallets/:walletId/policy** — Update policy (auth: `x-api-key`)
- **POST /transactions/request** — Submit transaction intent (auth: `x-api-key`). Body: `walletId`, `to`, `amount`, optional `tokenAddress`, `data`. Request is evaluated against policy and stored as `approved` or `rejected`

## Setup

```bash
cp .env.example .env
# Edit .env: set MONGODB_URI (default: mongodb://localhost:27017/agentguard)
npm install
npm run dev
```

## Quick test

```bash
# Create agent (save the apiKey from response)
curl -X POST http://localhost:3000/agents -H "Content-Type: application/json" -d '{"name":"Demo Agent"}'

# Create wallet (use apiKey in header)
curl -X POST http://localhost:3000/wallets -H "Content-Type: application/json" -H "x-api-key: YOUR_API_KEY" -d '{"address":"0x1234567890123456789012345678901234567890","policyTemplateType":"subscription","policyOverrides":{"perTxLimit":"100","allowedContracts":["0x1234567890123456789012345678901234567890"]}}'

# Request transaction (use same apiKey)
curl -X POST http://localhost:3000/transactions/request -H "Content-Type: application/json" -H "x-api-key: YOUR_API_KEY" -d '{"walletId":"WALLET_ID","to":"0x1234567890123456789012345678901234567890","amount":"50"}'
```
