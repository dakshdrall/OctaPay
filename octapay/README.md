# OctaPay

## Project Overview
OctaPay is a self-custodial DeFi super-app built on Stellar Testnet and Soroban smart contracts. Users can create and fund testnet wallets, invest in yield products, borrow against collateral, send USDC, and monitor earnings through a responsive dashboard.

## Features
- User registration and authentication (email/password + JWT).
- Automated Stellar testnet wallet creation and Friendbot funding.
- Wallet balance overview (XLM & test USDC) and transaction history.
- Investment products simulation (multiple APY tiers).
- Borrowing via Soroban loan contract (collateral deposit, borrow, repay, liquidate).
- Virtual spending dashboard with mock card actions.
- Portfolio growth chart and detailed transaction history.
- Secure backend wallet secret encryption (AES-256-GCM).

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Recharts
- Backend: Node.js, Express, Prisma, PostgreSQL, bcrypt, JWT
- Blockchain: Stellar SDK (testnet), Soroban smart contracts
- Contracts: Rust + Soroban SDK

## Setup Instructions
### Prerequisites
- Node.js 20+ / npm
- PostgreSQL
- Rust + cargo (for Soroban contract build)

### Backend
1. `cd octapay/backend`
2. `cp .env.example .env`
3. Fill values in `.env` (see Environment Variables below)
4. `npm install`
5. `npx prisma migrate dev --name init`
6. `npm run dev`

### Frontend
1. `cd octapay/frontend`
2. `npm install`
3. `npm run dev`

### Contract
1. `cd octapay/contracts/lending_contract`
2. `cargo build --release`
3. Deploy using Soroban tooling (or local test config)

## Environment Variables
Backend `.env` should include:
- `DATABASE_URL` (PostgreSQL connection)
- `JWT_SECRET` (secure secret)
- `WALLET_ENCRYPTION_KEY` (32-byte key for AES-256-GCM)
- `STELLAR_USDC_ISSUER` (test USDC issuer public key)
- `STELLAR_USDC_SECRET` (issuer secret for token minting)
- `PORT` (optional)

## Live Demo / Video Placeholders
- Live demo: _[Insert deployment URL here]_
- Demo video: _[Insert video URL / hosted recording link here]_

## User Wallets (Testing)
See [docs/USER_WALLETS.md](docs/USER_WALLETS.md) for 5 verifiable Stellar testnet wallets.

## Architecture
For architecture details, see: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
