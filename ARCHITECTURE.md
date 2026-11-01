# PledgePilot System Architecture

## 1. High-Level Architecture
PledgePilot is built on a decoupled N-tier architecture separating the React client from the Express/Node.js API gateway and MongoDB data tier.

[ Frontend: React / TypeScript / Redux / Stripe ]
│  (HTTP / REST / JWT / WebSockets)
▼
[ Backend Gateway: Express.js + CORS + CookieParser + VerifyJWT ]
│
┌────────────────────┴────────────────────┐
▼                                         ▼
[ Express Router Tree ]            [ Multer Storage ]
│                                (Images in public/images)
▼
[ Controllers & Services Layer ] ──► [ External: Stripe / Google OAuth ]
│
▼
[ Mongoose ODM & Native Driver ] + [ Redis Cache (Planned) ]
│
▼
[ MongoDB Atlas Database ]


## 2. Core Modules & Data Models
- **Users**: Authentication records, OAuth linkage, and gamified XP/tier tracking.
- **Campaigns**: Project metadata, funding goals, deadlines, and creator references.
- **Payments**: Transaction records tied to Stripe charge IDs and 10% gamified token distributions.
- **Milestones & Rewards**: Structured funding goals and tier-based item SKUs.

## 3. Planned Scalability & Engineering Roadmap
1. **Caching Layer (Redis)**: Offload hot campaign reads and maintain atomic counters for live funding progress.
2. **Async Event Queues (BullMQ)**: Decouple notification emails and ledger settlements from synchronous HTTP request loops.
3. **Real-Time WebSockets**: Stream live backer pledges and milestone unlocks directly to connected clients.