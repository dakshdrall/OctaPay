# OctaPay Architecture

## Overview
OctaPay is a self-custodial DeFi super-app built on Stellar testnet and Soroban smart contracts. The platform enables users to:

- Create and fund a Stellar testnet wallet (via Friendbot).
- Track balances (native XLM + test USDC) and transaction history.
- Invest in yield products (simulated on backend).
- Borrow against collateral using a Soroban lending contract (borrow/repay/liquidate flow).

The system is built as a **modern web app** with a React/Tailwind frontend, an Express API backend, and PostgreSQL for persistence.

---

## System Components

### 1) Frontend (React + Vite + Tailwind)

- **Routing**: React Router pages (Landing, Login/Register, Dashboard, Invest, Borrow, Spend, Profile).
- **Auth**: JWT-based auth against backend; auth state is stored in localStorage.
- **Wallet UX**: Users never see secret keys; wallet creation and signing happen on the server.
- **API Layer**: Hooks and services call backend endpoints for wallet balance, transactions, investments, loans, and spending.

### 2) Backend (Node.js + Express + Prisma)

- **Auth**: Email/password login (bcrypt), JWT issuance, and protected routes.
- **Wallet**: Creates a Stellar testnet account, funds it via Friendbot, and stores an encrypted secret key in PostgreSQL.
- **Stellar Integration**: Uses `stellar-sdk` to query balances, submit transactions, and manage USDC trustlines.
- **Investments**: Mock investment products with simple APY simulations, tracked in DB.
- **Loans**: Interacts with the Soroban lending contract for collateral, borrowing, repayment, and liquidation.
- **Transactions**: Tracks both on-chain Stellar transactions and in-app actions.

### 3) Database (PostgreSQL via Prisma)

- Stores users, wallets, investments, loans, and transaction history.
- All sensitive data (e.g., Stellar secret keys) is encrypted before storage.

### 4) Blockchain (Stellar Testnet + Soroban)

- **Stellar Testnet**: Used for all user wallets and token transfers.
- **USDC (test)**: Issued on testnet; users can hold/test USDC in wallet.
- **Soroban**: Smart contract for lending; tracks collateral and borrowed amount entirely in contract storage.

---

## High-Level Data Flow

```text
[Browser] <--JWT--> [Express API] <--> [Postgres]
      |               |                     /
      |               |                    /  (encrypted secret key)
      |               |                   /
      |               +---> [Stellar Testnet] <-> [Soroban Contract]
      |                                              |
      |                                              +--> Contract Storage (Collateral / Borrowed)
      |
      +---> UI (wallet balance, investments, loans, transactions)
```

---

## API Surface (Key Endpoints)

### Auth
- `POST /api/auth/register` – create user, build Stellar wallet, fund via Friendbot
- `POST /api/auth/login` – authenticate, return JWT
- `GET /api/auth/me` – return current user

### Wallet
- `GET /api/wallet` – user wallet info
- `GET /api/wallet/balance` – XLM + USDC balances
- `GET /api/wallet/transactions` – recent Stellar transactions
- `POST /api/wallet/send` – send USDC to another Stellar address

### Investments
- `GET /api/invest` – list mock investment products
- `POST /api/invest` – allocate funds to an investment
- `POST /api/invest/withdraw` – withdraw funds from an investment

### Borrow / Lending
- `GET /api/borrow` – loan summary + contract state
- `POST /api/borrow/deposit-collateral` – deposit collateral into Soroban contract
- `POST /api/borrow/borrow` – borrow USDC (increases borrowed amount)
- `POST /api/borrow/repay` – repay borrowed amount
- `POST /api/borrow/liquidate` – liquidate an unhealthy position

---

## Database Schema (Prisma)

Key tables stored in `prisma/schema.prisma` include:

- `User` – basic identity, email, hashed password
- `Wallet` – Stellar address, encrypted secret key, current balance cache
- `Investment` – product selection, amount, APY, status
- `Loan` – collateral, borrowed amount, repaid amount, health status
- `Transaction` – captures wallet & app activity

---

## Soroban Lending Contract (Contracts/Lending)

The Soroban contract is responsible for:

- Storing per-user loan records in contract storage.
- Allowing users to `deposit_collateral`, `borrow`, `repay`, and `liquidate`.
- Enforcing a simple risk model: maximum borrow is 60% of collateral.
- Computing a scaled health factor (100 = 1.0) and allowing liquidation when < 100.

Contract code lives in `contracts/lending_contract/src/lib.rs` and is compiled with Cargo.

---

## Security & Secrets

- **JWT**: Secured with `JWT_SECRET` and short-lived tokens.
- **Stellar secret keys**: Encrypted with `WALLET_ENCRYPTION_KEY` using AES-256-GCM before persisting.
- **Env vars**: Always stored in `.env` locally (not in source control) and set as secrets in deploy platforms.

Key environment variables:
- `DATABASE_URL`
- `JWT_SECRET`
- `WALLET_ENCRYPTION_KEY`
- `STELLAR_USDC_ISSUER` (test USDC issuer address)
- `STELLAR_USDC_SECRET` (issuer secret key, for testnet USDC distribution)
- `PORT` / `NODE_ENV`

---

## Local Development

1. Copy `.env.example` to `.env` and fill in values.
2. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
3. Start backend:
   ```bash
   npm run dev --workspace backend
   ```
4. Start frontend:
   ```bash
   npm run dev --workspace web
   ```

---

## Deployment Notes

- Keep the Soroban contract ID/ID in sync between frontend and backend if used directly.
- Ensure production uses a real Stellar network or a dedicated testnet instance.
- Monitor and rotate keys (e.g., `WALLET_ENCRYPTION_KEY`) regularly.
