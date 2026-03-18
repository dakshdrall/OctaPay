# OctaPay Architecture

## Overview
OctaPay is a self-custodial DeFi super-app built on Stellar testnet and Soroban smart contracts. The system is split into:

- **Frontend**: React + Tailwind UI deployed on Vercel.
- **Backend**: Node.js + Express API deployed on Render/Railway.
- **Database**: PostgreSQL via Prisma ORM (hosted on Supabase/Railway).
- **Blockchain**: Stellar SDK (stellar-sdk) + Soroban smart contract for micro-lending.

## Key Components

### Frontend (React)
- **Routing**: React Router for pages (Landing, Login, Dashboard, Invest, Borrow, Spend, Profile)
- **Auth**: JWT-based auth against backend, with Google OAuth/email login flows.
- **Wallet UX**: Users never see private keys; wallet creation & funding happens server-side.

### Backend (Express)
- **Auth**: Google/email login, JWT issuance, user/session management.
- **Wallet**: Creates Stellar testnet accounts, funds via Friendbot, encrypts private key in DB.
- **Investments**: Mock yield products with simulated APY.
- **Lending**: Soroban contract integration for collateral, borrow, repay, and loan health.
- **Transactions**: Tracks on-chain and in-app transactions.

### Database (PostgreSQL)
- User, wallet, investment, loan, and transaction tables.
- Prisma for schema and runtime querying.

### Soroban Smart Contract
- Micro-lending contract to deposit collateral, calculate borrow limit (60%), borrow, repay, and liquidate.
- Stored on Stellar testnet with contract state stored in Soroban storage.

## Deployment
- **Frontend**: Vercel (auto-deploy from GitHub branch).
- **Backend**: Render/Railway with environment variables from `.env` / platform secrets.
- **Database**: Supabase Postgres (or any PostgreSQL provider).
