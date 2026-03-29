# OctaPay Architecture

## System Overview

OctaPay is a DeFi financial super-app built on the Stellar blockchain. It enables users to create wallets, send XLM, and explore on-chain transactions.

## Architecture Diagram
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │  HTTPS  │                 │  Prisma │                 │
│   React + Vite  │────────▶│  Node/Express   │────────▶│   PostgreSQL    │
│   (Vercel)      │         │   (Render)      │         │   (Supabase)    │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                                     │ Stellar SDK v11
                                     ▼
                            ┌─────────────────┐
                            │  Stellar Testnet │
                            │  Horizon API     │
                            │  Friendbot       │
                            └─────────────────┘
```

## Components

### Frontend (React + Vite)
- Deployed on Vercel
- Pages: Dashboard, Profile, Transactions, Borrow, Explorer
- Communicates with backend via REST API
- URL: https://octa-pay-frontend.vercel.app

### Backend (Node.js + Express)
- Deployed on Render
- REST API with JWT authentication
- Handles user registration, login, wallet management
- URL: https://octapay.onrender.com

### Database (PostgreSQL via Supabase)
- Tables: User, Wallet, Investment, Loan, Transaction
- Connected via Prisma ORM
- Session pooler connection for optimal performance

### Blockchain (Stellar Testnet)
- Stellar SDK v11 for wallet creation
- Horizon API for transaction queries
- Friendbot for testnet XLM funding
- AES-256-GCM encryption for secret key storage

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user + create Stellar wallet |
| POST | /api/auth/login | Login and get JWT token |
| GET | /api/auth/me | Get current user with wallet |
| GET | /api/wallet/balance | Get XLM balance |
| POST | /api/wallet/send | Send XLM to another user |

## Security
- JWT authentication (7 day expiry)
- AES-256-GCM encryption for Stellar secret keys
- bcrypt password hashing (12 rounds)
- Environment variables for all secrets
