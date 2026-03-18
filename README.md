# OctaPay

OctaPay is a self-custodial DeFi super-app built on Stellar (testnet) and Soroban smart contracts, designed for emerging markets. It enables users to Save, Earn, Borrow, and Spend using USDC without needing crypto expertise.

## 📦 Repository Structure

- `octapay/frontend` – React + Tailwind UI (Vite)
- `octapay/backend` – Node.js + Express API
- `octapay/contracts` – Soroban smart contract (Rust)
- `octapay/docs` – architecture docs, feedback tracker, test wallets

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm
- PostgreSQL (Supabase / Railway / local)

### Run locally

1. Copy env templates:
   - `cp .env.example .env`
   - `cp octapay/backend/.env.example octapay/backend/.env`
2. Fill in database and auth config.
3. Install dependencies:
   ```bash
   npm install
   npm --workspace octapay/backend install
   npm --workspace octapay/frontend install
   ```
4. Start backend + frontend (monorepo):
   ```bash
   npm run dev
   ```

## 🧭 Next Steps

- Implement Google OAuth & email auth flows
- Wire up Stellar wallet creation, friendbot funding, and encrypted key storage
- Deploy backend to Render / Railway and frontend to Vercel
- Deploy Soroban contract to Stellar testnet and integrate borrowing flow
