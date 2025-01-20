# Project Setup

## Prerequisites

- Node.js v22.x
- pnpm v9.x

## Steps

1. Clone the repository

2. Create a `.env` file in the root taking the `.env.example` as a reference

3. Install dependencies

   ```bash
   pnpm install
   ```

4. Start the server

   ```bash
   pnpm run dev
   ```

# Design decisions

Implemented the following features:

- Authentication flow (register, login)
- Auctions (create, get, get all)
- Bids (create)

Missing features:

- Refresh token implementation for further security
- Edit auctions
- Add triggers for auction start times notifications and availability status change
- Add triggres for auction end times notifications and availability status change
- Add images for auction items
