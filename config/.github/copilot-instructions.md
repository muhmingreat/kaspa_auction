# Kaspa Auction Engine — AI Agent Instructions

## Architecture Overview

**Kaspa Live Auction Engine** is a non-custodial, real-time auction platform where Kaspa blockchain transactions serve as bids. The architecture spans:

- **Frontend**: Next.js (React 19, TypeScript, Tailwind CSS + Radix UI)
- **Backend**: Node.js Express server with Socket.IO for WebSocket broadcast
- **Blockchain**: Kaspa testnet (BlockDAG consensus for bid ordering)

### Critical System Design

1. **Trustless Settlement**: All auction logic is off-chain; Kaspa provides payment settlement, ordering, and confirmation signals via UTXO detection.
2. **Event-Driven**: Backend monitors auction addresses for incoming transactions, validates bids, and broadcasts updates to clients.
3. **No Custody**: Funds never move through the backend—user wallets directly sign and submit transactions to Kaspa.

**Key Files**:
- [architectureAndUserFlow.md](../architectureAndUserFlow.md) — System architecture and user flows
- [project.md](../project.md) — Product requirements and scope

## Core Components & Patterns

### Backend (Server)

**Key Module**: [server/src/engine.ts](../server/src/engine.ts) — `AuctionEngine` class

- Loads/saves auction state to JSON (`server/data/auctions.json`)
- Validates incoming bids via cryptographic verification
- Enforces business rules: auction status, minimum increment, bid ordering

**Kaspa Integration**: [server/src/kaspa.ts](../server/src/kaspa.ts) — `KaspaService` class

- RPC calls to fetch address UTXOs and verify transactions
- `monitorAddress()` polls for new UTXOs; emits detected transactions
- Returns tx data: `hash`, `amount`, `sender`, `timestamp`

**Real-Time Updates**: [server/src/index.ts](../server/src/index.ts)

- Socket.IO broadcasts to all clients:
  - `all_auctions` — Initial state on connect
  - `new_bid` — New bid detected and validated
  - `auction_updated` — Auction state changes
- Active monitors stored in `Map<auctionId, stopMonitor>`

### Frontend (Web)

**Auction Data Flow**: [hooks/use-auctions.ts](../hooks/use-auctions.ts)

- Establishes Socket.IO connection via [lib/socket.ts](../lib/socket.ts)
- Listens for `all_auctions`, `auction_updated`, `new_bid` events
- Updates state immutably; bid state includes status: `'pending'` → `'detected'` → `'confirmed'`

**Bid Submission**: [components/bid-controls.tsx](../components/bid-controls.tsx)

- User enters amount (must exceed `currentPrice + minimumIncrement`)
- Connects to Kaspa wallet (external, not managed by app)
- Wallet signs transaction with destination = auction receiving address
- Transaction hash returned to frontend for tracking

**Component Organization**: 
- [components/auction/](../components/auction/) — Auction detail views
- [components/create/](../components/create/) — Auction creation forms
- [components/home/](../components/home/) — Landing page sections
- [components/ui/](../components/ui/) — Radix-based UI primitives

### Shared Types

[types/auction.ts](../types/auction.ts) — Single source of truth:

```typescript
Bid { id, auctionId, bidderAddress, amount (KAS), timestamp, status: BidStatus }
Auction { id, title, seller, startPrice, currentPrice, endTime, status: AuctionStatus, bids[] }
BidStatus = 'pending' | 'detected' | 'confirmed'
AuctionStatus = 'live' | 'ending-soon' | 'ended' | 'upcoming'
```

## Developer Workflows

### Build & Run

```bash
# Frontend (Next.js dev server on port 3000)
npm run dev

# Backend (Node.js server on port 3001)
cd server && npm run dev

# Lint
npm run lint
```

**Environment Variables** (server/.env):
- `KASPA_RPC_URL_TESTNET` — Kaspa API endpoint (default: `https://api.testnet.kaspa.org`)
- `NEXT_PUBLIC_SOCKET_URL` — Backend WebSocket URL (default: `http://localhost:3005`)

### Testing

Backend tests: [server/tests/engine.test.ts](../server/tests/engine.test.ts)
- Jest configuration in `server/jest.config.js`
- Run: `cd server && npm test`

### Verification

Script [verify-engine.js](../verify-engine.js) manually tests auction flow with mock Kaspa responses.

## Project-Specific Conventions

### Bid Validation Rules

[server/src/engine.ts](../server/src/engine.ts) enforces in strict order:

1. **RULE 0**: Re-verify transaction cryptographically on Kaspa (prevents spoofing)
2. **RULE 1**: Auction must be `'live'` (no bids after end time)
3. **RULE 2**: Bid amount ≥ `currentPrice + minimumIncrement`
4. **RULE 3**: No duplicate bids from same sender
5. **RULE 4**: Bid ordering determined by Kaspa DAG consensus (via `blueScore` or detection time)

**Security Boundary**: Frontend is untrusted; backend re-verifies all claims.

### Auction Lifecycle

1. **Creation**: `createAuction()` generates ID, receiving address, initializes `status: 'live'`
2. **Bidding**: Bids detected via UTXO polling, validated, added to `auction.bids` array
3. **State Transitions**: `'live'` → `'ending-soon'` (timer < 5 min) → `'ended'` (timer expires)
4. **Finalization**: Highest confirmed bid wins; no refunds (funds already on-chain)

### UI State Management

- **Bid Status Badges**: Visual feedback for `pending` (amber pulse), `detected` (green fade), `confirmed` (green check)
- **Forms**: Use React Hook Form + Zod validation (see [components/create/create-auction-form.tsx](../components/create/create-auction-form.tsx))
- **Animations**: Framer Motion for bid list transitions and state changes
- **Theme**: Radix theme provider; light/dark modes supported

### Data Persistence

- Frontend state: Ephemeral (Socket.IO broadcast)
- Backend state: JSON file at `server/data/auctions.json` (loaded on startup, saved after mutations)
- No database—suitable for hackathon; production would use persistent store

## Integration Points

### Kaspa Wallet (Browser)

- Users connect external wallet (e.g., Kaspa web wallet)
- Wallet signs transactions; app never holds keys
- Transaction submitted directly to Kaspa network

### Kaspa API

- **REST**: Fetch address UTXOs, verify transactions
- **Polling**: `monitorAddress()` checks every 5 seconds for new UTXOs (MVP approach; upgrade to WebSocket in production)

### Socket.IO Events

**Backend Emits**:
- `all_auctions` → Client on connect
- `auction_updated` → Clients after state change
- `new_bid` → Clients when bid validated

**Client Emits** (if implemented):
- `create_auction` → Trigger auction creation on server
- `cancel_auction` → Admin action (not in MVP)

## Quick Reference

| Task | File(s) | Notes |
|------|---------|-------|
| Add auction field | [types/auction.ts](../types/auction.ts), [server/src/engine.ts](../server/src/engine.ts), components | Update type + validation logic |
| Change Kaspa endpoint | `.env` (server/.env) | Testnet/mainnet via `NEXT_PUBLIC_KASPA_NETWORK` |
| Add bid validation rule | [server/src/engine.ts](../server/src/engine.ts) line ~85 | Insert before existing rules |
| Style new component | [components/ui/](../components/ui/) | Radix primitive + Tailwind; follow design system |
| Debug bid detection | [server/src/kaspa.ts](../server/src/kaspa.ts) + `monitorAddress()` | Add console logs; check RPC endpoint |
| Handle real-time updates | [hooks/use-auctions.ts](../hooks/use-auctions.ts) | Socket.IO listeners; state mutations |

---

**Last Updated**: January 2026  
**Codebase Type**: Hackathon MVP for Kaspa blockchain integration  
**Primary Language**: TypeScript  
**Key Dependencies**: Next.js 16, Express, Socket.IO, Radix UI, Tailwind CSS
