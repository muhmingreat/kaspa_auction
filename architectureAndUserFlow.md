# Kaspa Live Auction Engine — Architecture

## 1. High-Level System Architecture

The Kaspa Live Auction Engine follows a **non-custodial, event-driven architecture**. All auction logic is handled off-chain, while Kaspa provides trustless payment settlement, ordering, and confirmation signals.

### Core Components

1. **Frontend (Web App)**

   * Built with React / Next.js
   * Integrates with Kaspa browser wallet
   * Displays live auction state
   * Connects to backend via WebSocket

2. **Backend (Auction Engine)**

   * Node.js service
   * Connects to Kaspa testnet via RPC + WebSocket
   * Verifies incoming bids (UTXO-based)
   * Maintains authoritative auction state
   * Broadcasts real-time updates to clients

3. **Kaspa Network (Testnet)**

   * Receives signed transactions (bids)
   * Orders transactions via BlockDAG consensus
   * Emits events for blocks, transactions, and UTXO changes

### Architecture Diagram (Textual)

```
+------------------+        WebSocket        +----------------------+
|                  | <--------------------> |                      |
|   Web Frontend   |                        |      Backend         |
|  (Next.js)       |                        |  (Auction Engine)    |
|                  |                        |                      |
+--------+---------+                        +----------+-----------+
         |                                                       |
         | Wallet API                                            | Kaspa RPC / WS
         |                                                       |
+--------v---------+                        +----------v-----------+
|                  |                        |                      |
| Kaspa Browser    |   Signed Transactions  |   Kaspa Testnet      |
| Wallet           | ---------------------> |   (BlockDAG)         |
|                  |                        |                      |
+------------------+                        +----------------------+
```

---

# Kaspa Live Auction Engine — User Flow

## 1. Bid Lifecycle (End-to-End)

1. User initiates a bid from the frontend
2. Kaspa wallet signs and submits a transaction
3. Transaction is propagated to Kaspa testnet
4. Backend receives UTXO change event via WebSocket
5. Backend validates the bid
6. Backend updates auction state
7. Backend broadcasts update to all connected clients

## 2. Detailed User Flows

### 2.1 Auction Creation Flow

**Actors:** Auction Creator, Backend

Steps:

1. Creator opens "Create Auction" screen
2. Inputs item details, start price, duration
3. Frontend sends auction configuration to backend
4. Backend generates auction ID and receiving address
5. Auction state initialized and broadcast to clients

### 2.2 Bidding Flow (Primary Flow)

**Actors:** Bidder, Kaspa Wallet, Backend, Kaspa Network

Steps:

1. Bidder clicks "Place Bid"
2. Frontend requests wallet connection (if not connected)
3. Bidder confirms transaction in wallet
4. Wallet submits signed transaction to Kaspa testnet
5. Backend detects UTXO change for auction address
6. Backend validates:

   * Destination address
   * Minimum bid amount
   * Auction still active
7. Bid accepted and recorded
8. Real-time update broadcast to frontend

### 2.3 Bid Confirmation States

* **Pending:** Transaction submitted but not yet detected
* **Detected:** UTXO observed via Kaspa WebSocket
* **Confirmed:** Accepted by DAG consensus (sufficient confidence)

### 2.4 Auction Finalization Flow

Steps:

1. Auction timer expires
2. Backend locks auction state
3. Highest valid confirmed bid is selected
4. Winning bid is announced to all clients
5. Auction marked as completed

No funds are moved by the backend; settlement already occurred via Kaspa.

## 3. Security Boundaries

* Frontend is untrusted
* Backend verifies all blockchain data
* Kaspa network is source of truth for payments

## 4. Scalability Considerations

* WebSocket-based broadcast allows many clients
* Auction logic is lightweight per bid
* Can scale horizontally with shared state store (future)
