import { Router } from "express";

import { authenticate } from "@/middleware/authenticate";
import {
  createAuctionWithItems,
  getAuctionById,
  getAuctionList,
  getAuctionsFromCurrentUser,
} from "./auctions.controller";

export const auctionsRouter = Router();

auctionsRouter.post("/", authenticate, createAuctionWithItems);

auctionsRouter.get("/", authenticate, getAuctionList);

auctionsRouter.get("/current", authenticate, getAuctionsFromCurrentUser);

auctionsRouter.get("/:auctionId", authenticate, getAuctionById);
