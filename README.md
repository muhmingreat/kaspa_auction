# Kaspa Live Auction Engine

**A real-time, high-frequency auction platform powered by Kaspa's BlockDAG.**

![Kaspa Auction Engine](https://github.com/YourUsername/kaspa-auction-engine/raw/main/public/demo-screenshot.png) 
*(Replace with actual screenshot or delete if not available)*

## 🎥 Demo & Live Link

-   **Live Deployment**: [https://kaspa-auction.vercel.app/] (Optional but recommended)
-   **Demo Video**: [https://youtu.be/pSpaI_T9bzU] (Required: 3 mins max)


## 🚀 Overview

**Kaspa Live Auction Engine** leverages Kaspa's millisecond block times to create an auction experience that feels instant. Unlike traditional blockchains where you wait minutes for confirmation, this engine detects and visualizes bids in real-time, enabling a snappy, reactive commerce experience previously impossible on PoW chains.

**Category**: Payments & Commerce  
**Network**: Kaspa Testnet 10

## ✨ Features

-   **⚡ Real-Time Bidding**: Bids are native Kaspa transactions detected instantly via WebSocket monitoring.
-   **🛡️ Trustless Settlement**: Winners pay directly to the seller's wallet; the platform never holds custody of funds.
-   **⏱️ High-Speed UX**: Visualizes the power of Kaspa's 1BPS (and future higher BPS) throughput.
-   **📈 Live Updates**: Socket.io integration pushes auction status changes to all connected clients immediately.

## 🛠️ Technology Stack

-   **Frontend**: Next.js 15 (App Router), TailwindCSS, Framer Motion, Lucide Icons.
-   **Backend**: Node.js, Express, Socket.io.
-   **Integration**: Direct Kaspa API (REST/RPC) interaction for UTXO monitoring.
-   **Wallet**: KasWare Wallet integration.

## ⚙️ prerequisites

-   **Node.js**: v18 or higher.
-   **KasWare Wallet**: Browser extension installed and switched to **Testnet**.
-   **Kaspa Faucet**: You will need Testnet KAS to bid. [Get some here](https://faucet.kaspanet.io/).

## 🚀 Getting Started

### 1. Clone the Repository for client
```bash
git clone https://github.com/muhmingreate/kaspa-auction.git
cd kaspa-auction
```
### 1a. Clone the Repository for server
```bash
git clone https://github.com/muhmingreate/kaspa-auction-server.git
cd kaspa-auction-server
```
### 2. Install Dependencies
There are two parts to install: the frontend and the backend server.

**Root (Frontend)**
```bash
npm install
```

**Server (Backend)**
```bash
cd server
npm install
```

### 3. Configure Environment
Create a `.env` file in the `server` directory:

```env
# server/.env
PORT=3001
KASPA_RPC_URL_TESTNET=https://api-tn10.kaspa.org
NETWORK=testnet
```

### 4. Run the Application
You need to run both the frontend and backend.

**Terminal 1 (Backend)**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend)**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 How it Works

1.  **Create Auction**: Fill out the form. The system monitors your wallet address.
2.  **Place Bid**: When you bid, you send a real KAS transaction to the seller.
3.  **Detection**: The backend polls the Kaspa Node/API for new UTXOs on the seller's address.
4.  **Update**: As soon as the transaction is seen in the mempool/DAG, the UI updates instantly via WebSockets.



## 🏆 Hackathon Tracks


-   **Payments & Commerce**: Reimagining e-commerce with instant PoW settlement.
-   **Real-Time Data**: Visualizing live BlockDAG data to drive user action.

## 📄 License
MIT
