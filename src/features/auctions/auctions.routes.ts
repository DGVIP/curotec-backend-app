import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import {
  createAuctionWithItems,
  getAuctionById,
  getAuctionList,
} from "./auctions.controller";

export const auctionsRouter = Router();

auctionsRouter.post("/", authenticate, createAuctionWithItems);

auctionsRouter.get("/:auctionId", authenticate, getAuctionById);

auctionsRouter.get("/", authenticate, getAuctionList);
