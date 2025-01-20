import { startSession } from "mongoose";
import { Request, Response } from "express";

import { Bid } from "@/models/bid.model";
import { AuctionItem } from "@/models/auction-item.model";

export const createBid = async (req: Request, res: Response) => {
  const { auctionItemId, amount } = req.body;

  try {
    const auctionItem = await AuctionItem.findById(auctionItemId);

    if (!auctionItem) {
      res.status(404).json({ message: "Auction not found" });
      return;
    }

    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized access" });
      return;
    }

    if (auctionItem.createdBy.toString() === userId) {
      res.status(400).json({ message: "You cannot bid on your own auction" });
      return;
    }

    const session = await startSession();

    const bidId = await session.withTransaction(async () => {
      const bid = new Bid({
        amount,
        auctionItem: auctionItemId,
        user: userId,
      });

      const createdBid = await bid.save();

      await AuctionItem.updateOne(
        { _id: auctionItem._id },
        { $push: { bidHistory: bid._id } }
      );

      return createdBid._id.toString();
    });

    res.status(201).json({
      message: "Bid created successfully",
      bidId,
    });
  } catch {
    res.status(500).json({ message: "Failed to create bid" });
  }
};
