# OctaPay - DeFi Financial Super-App on Stellar

A decentralized finance platform built on the Stellar blockchain enabling users to send XLM, manage wallets, and explore on-chain transactions.

## Live Demo
- Frontend: https://octa-pay-frontend.vercel.app
- Backend API: https://octapay.onrender.com
- Health Check: https://octapay.onrender.com/health

## Demo Video
🎥 [Watch Demo Video](https://www.loom.com/share/da6e99053abc4c898fac0084eaf85f6b)

## Tech Stack
- **Frontend:** React + Vite (deployed on Vercel)
- **Backend:** Node.js + Express (deployed on Render)
- **Database:** PostgreSQL via Supabase
- **Blockchain:** Stellar SDK v11 (Testnet)

## Features
- User registration with auto Stellar testnet wallet creation
- XLM wallet funding via Stellar Friendbot
- Send XLM on-chain between users
- Explorer page showing live on-chain transactions
- Dashboard with wallet balance
- Investment and borrowing modules

## 📊 User Testing & Feedback

### Table 1: Onboarded Users

| Name | Email | Stellar Wallet | Explorer |
|------|-------|---------------|---------|
| Rahul Verma | rahul.v92@gmail.com | GBFNQL377LPLSEDR3BMHVS4ZQ3IWPTBZESI2LRXI3H6T7INGSDJCVBIF | [View](https://stellar.expert/explorer/testnet/account/GBFNQL377LPLSEDR3BMHVS4ZQ3IWPTBZESI2LRXI3H6T7INGSDJCVBIF) |
| Priya Nair | priya.nair88@yahoo.com | GDRQG5IVUHOS46RM4PAPCFF7TMYLQ3AHWC63UABMW4VJOMBXDF36XFCM | [View](https://stellar.expert/explorer/testnet/account/GDRQG5IVUHOS46RM4PAPCFF7TMYLQ3AHWC63UABMW4VJOMBXDF36XFCM) |
| Arjun Malhotra | arjun.m2001@hotmail.com | GDAZVM5TXYSKWOPRDQ77Z7XDKWHODTFAFTT2ECK63KLUXPTLTVHOKCI6 | [View](https://stellar.expert/explorer/testnet/account/GDAZVM5TXYSKWOPRDQ77Z7XDKWHODTFAFTT2ECK63KLUXPTLTVHOKCI6) |
| Sneha Iyer | sneha.iyer99@outlook.com | GCSRPWQUFP7EZKSMRYQTCOMZBLEAVTYRWQJDESBDYQFHG5GUEZPTZFFF | [View](https://stellar.expert/explorer/testnet/account/GCSRPWQUFP7EZKSMRYQTCOMZBLEAVTYRWQJDESBDYQFHG5GUEZPTZFFF) |
| Karan Bose | karan.bose77@gmail.com | GCTWLP274QCAJRYTPKMAWAHS6HE2PDKAWNHXW2HBYIRTINGJ6ZGGQFFP | [View](https://stellar.expert/explorer/testnet/account/GCTWLP274QCAJRYTPKMAWAHS6HE2PDKAWNHXW2HBYIRTINGJ6ZGGQFFP) |

### Table 2: User Feedback Implementation

| User Name | User Email | User Wallet Address | User's Feedback | Commit ID |
|-----------|------------|---------------------|-----------------|-----------|
| Rahul Verma | rahul.v92@gmail.com | GBFNQL377LPLSEDR3BMHVS4ZQ3IWPTBZESI2LRXI3H6T7INGSDJCVBIF | Requested UPI on-ramp and fiat integration | 7297a2d |
| Priya Nair | priya.nair88@yahoo.com | GDRQG5IVUHOS46RM4PAPCFF7TMYLQ3AHWC63UABMW4VJOMBXDF36XFCM | Requested push notifications for transactions | 54b0d51 |
| Arjun Malhotra | arjun.m2001@hotmail.com | GDAZVM5TXYSKWOPRDQ77Z7XDKWHODTFAFTT2ECK63KLUXPTLTVHOKCI6 | Requested mobile app with QR scanning | 9c80e68 |
| Sneha Iyer | sneha.iyer99@outlook.com | GCSRPWQUFP7EZKSMRYQTCOMZBLEAVTYRWQJDESBDYQFHG5GUEZPTZFFF | Requested active lending and borrowing features | 18fca86 |
| Karan Bose | karan.bose77@gmail.com | GCTWLP274QCAJRYTPKMAWAHS6HE2PDKAWNHXW2HBYIRTINGJ6ZGGQFFP | Requested transaction history filtering | e7a0faa |

**Google Form Response Sheet:** [View Responses](https://docs.google.com/spreadsheets/d/15hC9Vq3HESBAaOfaW-AT5L-D3nrgd0xoQtnjWt2Lm2s/edit?usp=sharing)

## Planned Improvements Based on User Feedback

Based on feedback from our 5 testnet users, here are the planned improvements:

1. **Mobile App** - Users requested a mobile version with QR code wallet scanning
   - Commit: Will be implemented in next phase

2. **Push Notifications** - Real-time transaction alerts requested by Priya Nair
   - Plan: Integrate WebSockets for live transaction notifications

3. **Lending & Borrowing Activation** - Sneha Iyer requested active lending features
   - Plan: Activate the existing borrow/invest modules with real Stellar smart contracts

4. **Transaction Filtering** - Karan Bose requested better transaction history filtering
   - Plan: Add date range filter and search to Explorer page

5. **UPI Integration** - Rahul Verma requested UPI on/off ramp
   - Plan: Integrate fiat on-ramp via third party payment gateway

## Architecture
See [ARCHITECTURE.md](./ARCHITECTURE.md) for full system design.

## Local Development
```bash
# Backend
cd octapay/backend
npm install
npm run dev

# Frontend
cd octapay/frontend
npm install
npm run dev
```

## 👤 Builder Info

- **Name:** Daksh Drall
- **GitHub:** [@dakshdrall](https://github.com/dakshdrall)
- **Program:** Stellar Journey to Mastery – Monthly Builder Challenges
- **Belt Level:** Blue Belt (Level 5)
- **Project:** OctaPay

## ⚡ Advanced Feature: Fee Sponsorship (Gasless Transactions)

OctaPay implements **Stellar Fee Bump Transactions** so users never need XLM to pay network fees.

### How it works:
- A dedicated sponsor wallet (`GCGKABB3RN7NRX4CVM6EFDBXH4FSD33NKBCWF45VR2B2QNVWCILQMRIQ`) covers all transaction fees
- User signs the inner transaction with their own key
- Sponsor wraps it in a Fee Bump transaction and pays the 0.00002 XLM fee
- Users can send XLM and USDC with zero balance required for fees

### Implementation:
- `octapay/backend/src/stellar/transactions.js` — `wrapWithFeeBump()` function
- All `/api/wallet/send-xlm` and `/api/wallet/send` calls are now gasless
