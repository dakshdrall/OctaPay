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
| Rahul Verma | rahul.v92@gmail.com | GBFNQL377LPLSEDR3BMHVS4ZQ3IWPTBZESI2LRXI3H6T7INGSDJCVBIF | Requested UPI on-ramp and fiat integration | baa9c9b |
| Priya Nair | priya.nair88@yahoo.com | GDRQG5IVUHOS46RM4PAPCFF7TMYLQ3AHWC63UABMW4VJOMBXDF36XFCM | Requested push notifications for transactions | 9ddb4f7 |
| Arjun Malhotra | arjun.m2001@hotmail.com | GDAZVM5TXYSKWOPRDQ77Z7XDKWHODTFAFTT2ECK63KLUXPTLTVHOKCI6 | Requested mobile app with QR scanning | 18fca86 |
| Sneha Iyer | sneha.iyer99@outlook.com | GCSRPWQUFP7EZKSMRYQTCOMZBLEAVTYRWQJDESBDYQFHG5GUEZPTZFFF | Requested active lending and borrowing features | e7a0faa |
| Karan Bose | karan.bose77@gmail.com | GCTWLP274QCAJRYTPKMAWAHS6HE2PDKAWNHXW2HBYIRTINGJ6ZGGQFFP | Requested transaction history filtering | 1682325 |

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

## 🚀 Level 6 - Production Readiness

### 🐦 Community Contribution
[Tweet about OctaPay](https://x.com/dralldaksh/status/2045197976457347561)

### 📊 Metrics Dashboard
- Live at: https://octa-pay-frontend.vercel.app/metrics
- API endpoint: https://octapay.onrender.com/api/metrics

### 🔍 Monitoring
- Tool: UptimeRobot (2 monitors, 100% uptime)
- Backend: https://octapay.onrender.com/health ✅
- Frontend: https://octa-pay-frontend.vercel.app ✅

### 🔒 Security Checklist
- [x] Environment variables stored in .env (not committed)
- [x] Secrets encrypted in database (encryptedSecretKey)
- [x] Auth middleware on all protected routes
- [x] CORS enabled
- [x] Input validation on all API endpoints
- [x] HTTPS enforced on all deployments

## 👥 30+ Onboarded Users (Level 6)

| Name | Email | Stellar Wallet |
|------|-------|---------------|
| Rahul Verma | rahul.v92@gmail.com | GBFNQL377LPLSEDR3BMHVS4ZQ3IWPTBZESI2LRXI3H6T7INGSDJCVBIF |
| Priya Nair | priya.nair88@yahoo.com | GDRQG5IVUHOS46RM4PAPCFF7TMYLQ3AHWC63UABMW4VJOMBXDF36XFCM |
| Arjun Malhotra | arjun.m2001@hotmail.com | GDAZVM5TXYSKWOPRDQ77Z7XDKWHODTFAFTT2ECK63KLUXPTLTVHOKCI6 |
| Sneha Iyer | sneha.iyer99@outlook.com | GCSRPWQUFP7EZKSMRYQTCOMZBLEAVTYRWQJDESBDYQFHG5GUEZPTZFFF |
| Karan Bose | karan.bose77@gmail.com | GCTWLP274QCAJRYTPKMAWAHS6HE2PDKAWNHXW2HBYIRTINGJ6ZGGQFFP |
| Amit Sharma | amit.sharma91@gmail.com | GCX6ZYUN6F4WCKOODPRXUJ5N3ERIR36E7YMCXD72CRYDYYSY23YYELXM |
| Neha Gupta | neha.gupta88@yahoo.com | GCYMRTYV6TC3W6TVP6BXNXXVHE3VOCFRJQUYDSEFOAEPQV53LJFNSAQN |
| Rohan Mehta | rohan.mehta95@gmail.com | GAWMITACMVWY4JM4CMKDJG43QHNDKFAHRLJPU6EPG3UWZ4EXHXAPKACU |
| Divya Patel | divya.patel92@hotmail.com | GC677TY7MKL6S4ZGCJPW2TCNEEU55HC5L5WCU4RFVZVO6D24PKMGHICL |
| Vikram Singh | vikram.singh87@gmail.com | GDCPVQKTGWHNLHMNTETHMREYERJ2PKICLD2C6OXXA3VMNI75EXPNORNH |
| Pooja Iyer | pooja.iyer93@outlook.com | GAZEQLWZPUGM6PVIU4EMUHU7SZLQZIBAWGIU3VXO4YKDRHHP7WMBIQ72 |
| Aakash Joshi | aakash.joshi90@gmail.com | GB4USJIEJQU5RUKD26JOI6FQ3XUZJG4SWQ6T43RKAT5MYYRRUXK6NFRC |
| Shreya Nair | shreya.nair94@yahoo.com | GDQ3YI42JJP2M7XYQPMBNBHSTNNWPCCEXXCISLQWEA5YRAE2IU6QDVSQ |
| Manish Kumar | manish.kumar89@gmail.com | GC37TZ7XI4TZPIQSVM25TQ2VY6SL63OQ3C2SWIRWPTX3VYHDDTLRRBRH |
| Ananya Roy | ananya.roy96@gmail.com | GDGJLVBS7Q4LG5GT6DMLWILCLENPKNWLJ6AB2K365VUXPM6R3W6PFRT3 |
| Deepak Verma | deepak.verma85@hotmail.com | GCO7IYR3UKGTLWTNB2O3D3XRTKTNUAMDBDAO2BCUBH6N6CR6KGPDHPHK |
| Kavya Reddy | kavya.reddy97@gmail.com | GDLQ5N4XJG72DU72PZ5JW3MMQN4WHRNDRXPFSUNSEQ2FQM2A2DP66EZ2 |
| Siddharth Das | siddharth.das91@outlook.com | GBIL6L6EJUAXJBZXSDYDAZVXOIPHGRAQOO75UA3H2EHI7RUTGTCAZGHZ |
| Meera Pillai | meera.pillai88@gmail.com | GD3PZB5NILN7BMJJI5YLPWYQVEWA2NWTRJ6NYASD23NT5HROIZURV4UI |
| Harsh Agarwal | harsh.agarwal93@yahoo.com | GA4IH3UHZGMDNQBIDGYVVU3PE7LH2KMTBLRGRP3MSKLTE4F3UUWECR4Q |
| Riya Bose | riya.bose95@gmail.com | GBC42CY45LFBAOE6DXEOW4NIIUOOIQRSA2XTH3RKDAFD6LWYMDEZGYCC |
| Nikhil Jain | nikhil.jain87@hotmail.com | GDMM3DTMWTATGFDJIMMKTPIFZWGACKY2O3UY5WSW3SFPQYBOTCGQQQ6J |
| Swati Mishra | swati.mishra92@gmail.com | GBVVB5YUO2EBZE4WRUZJXNUAVIR7USABQHPNC4FYPCTQB3P3QEMNZPMO |
| Aryan Chopra | aryan.chopra96@outlook.com | GDW7VWABDYG3F4XYOOZNUWB4UEWK6RB5UARL5OBXXDXSFYVXG7R5QVJC |
| Tanvi Shah | tanvi.shah90@gmail.com | GBHOWQXBZIB6D4WQR4MQMCZEWNKNFL2BHTZAYRM6APXFZBWWTIIS3XEU |
| Gaurav Tiwari | gaurav.tiwari86@yahoo.com | GBTHWNXAEFFDLH4KVE36CYXVFXXVVU7DRMKKQX2MCDGPGVX7BF4M7U3Y |
| Ishaan Malik | ishaan.malik94@gmail.com | GCQCMDR5MPSAJ6PAC6KEIZ4PRXS27KSBNC72UOUMJF73CDVRRUMH7J6B |
| Prachi Saxena | prachi.saxena91@hotmail.com | GDQQ4LDVN7WOZHI7NUZNYDLPGZDQJSZMJICACV5UA6LBOMTSRSOFS5VM |
| Yash Pandey | yash.pandey93@gmail.com | GCMWUDBAYSYVCEPSTQKZM4UPIWN6NXHTBRLP3XZMYQSONTMHPI2E4NRB |
| Nisha Choudhary | nisha.choudhary89@outlook.com | GB542WSER5P7SNXHU3AO6NN6VXPHPVICXBOGE3IJAHYJ67K5H55XKUYN |
