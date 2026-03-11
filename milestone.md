Since the hackathon ends in **7 days**, the key is to **ship a focused MVP** that clearly proves the concept. Three milestones is perfect: **foundation → execution → demo-ready**.

---

## Milestones

### Milestone 1 — Agent Wallet & Policy Engine (Days 1–2)

Build the core infrastructure that allows agents to operate through a **controlled wallet layer** instead of holding private keys.

**Deliverables:**

- Agent wallet creation endpoint
- Policy configuration system for wallets
- Permission rules including:
  - spending limits
  - token allowlists
  - contract allowlists
- Agent authentication (API key or agent ID)
- Transaction request format for agents

**Outcome:**  
Agents can **request transactions**, but execution is governed by policy rules.

---

### Milestone 2 — Transaction Validation & Execution Layer (Days 3–5)

Implement the system that **evaluates and executes agent transactions safely**.

**Deliverables:**

- Transaction validation engine
- On-chain transaction simulation before execution
- Policy evaluation against wallet rules
- Secure transaction signer
- Integration with the Celo Sepolia testnet
- Basic activity logs for all agent actions

**Outcome:**  
Agents can safely **submit and execute transactions on Celo** within defined permissions.

---

### Milestone 3 — Monitoring, Demo Use Case & Agentscan Integration (Days 6–7)

Build the features that make the project **demonstrable and judge-friendly**.

**Deliverables:**

- Dashboard or simple UI to:
  - view agent wallets
  - monitor transactions
  - review policy rules
- Agent activity logs and execution history
- Demo agent that:
  - makes automated payments
  - respects spending limits
- Optional integration with Agentscan to track agent activity

**Outcome:**  
A **fully working demo** showing an agent autonomously executing blockchain transactions safely using AgentGuard.

---