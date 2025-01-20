import { Router } from "express";

import { authenticate } from "@/middleware/authenticate";

import { createBid } from "./bids.controller";

export const bidsRouter = Router();

bidsRouter.post("/", authenticate, createBid);
