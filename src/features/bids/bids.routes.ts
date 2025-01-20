import { Router } from "express";

import { createBid } from "./bids.controller";
import { authenticate } from "../../middleware/authenticate";

export const bidsRouter = Router();

bidsRouter.post("/", authenticate, createBid);
