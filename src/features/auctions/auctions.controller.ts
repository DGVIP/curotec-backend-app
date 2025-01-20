import { Request, Response } from "express";
import { AuctionItem, IAuctionItem } from "../../models/auction-item.model";
import { Auction } from "../../models/auction.model";
import { IBid } from "../../models/bid.model";
import { HydratedDocument, startSession } from "mongoose";
import { UserDocument } from "../../models/user.model";

export const createAuctionWithItems = async (req: Request, res: Response) => {
  const { title, items } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized access" });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: "Auction must have at least one item" });
    return;
  }

  try {
    const session = await startSession();

    const auctionId = await session.withTransaction(async () => {
      const auction = new Auction({
        title,
        createdBy: userId,
      });

      const createdAuction = await auction.save();

      for (const item of items) {
        const { title, startPrice, startTime, endTime } = item;

        const auctionItem = new AuctionItem({
          title,
          startPrice,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          currentBid: startPrice,
          createdBy: userId,
          auction: createdAuction._id,
        });

        await Auction.updateOne(
          { _id: createdAuction._id },
          { $push: { items: auctionItem._id } }
        );

        await auctionItem.save();
      }

      return createdAuction._id.toString();
    });

    res.status(201).json({
      message: "Auction created successfully",
      auctionId,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create auction" });
  }
};

export const getAuctionById = async (req: Request, res: Response) => {
  const { auctionId } = req.params;

  try {
    const auction = await Auction.findById(auctionId)
      .populate({
        path: "items",
        populate: {
          path: "bidHistory",
          populate: {
            path: "user",
          },
        },
      })
      .populate("createdBy")
      .exec();

    if (!auction) {
      res.status(404).json({ message: "Auction not found" });
      return;
    }

    const createdBy = auction.createdBy as unknown as UserDocument;

    const responseData = {
      id: auction._id.toString(),
      title: auction.title,
      timestamp: auction.timestamp.toISOString(),
      createdBy: {
        id: createdBy._id.toString(),
        username: createdBy.username,
      },
      items: (auction.items as unknown as HydratedDocument<IAuctionItem>[]).map(
        (item) => {
          return {
            id: item._id.toString(),
            title: item.title,
            startPrice: item.startPrice,
            startTime: item.startTime,
            endTime: item.endTime,
            currentBid: item.currentBid,
            bidHistory: (
              item.bidHistory as unknown as HydratedDocument<IBid>[]
            ).map((bid) => {
              const user = bid.user as unknown as UserDocument;
              return {
                amount: bid.amount,
                timestamp: bid.timestamp.toISOString(),
                user: {
                  id: user._id.toString(),
                  username: user.username,
                },
              };
            }),
          };
        }
      ),
    };

    res.status(200).json({ auction: responseData });
  } catch {
    res.status(500).json({ message: "Failed to fetch auction details" });
  }
};

export const getAuctionList = async (_req: Request, res: Response) => {
  try {
    const auctions = await Auction.find()
      .populate("createdBy")
      .sort({ timestamp: "descending" })
      .exec();

    const responseData = auctions.map((auction) => {
      const createdBy = auction.createdBy as unknown as UserDocument;
      return {
        id: auction._id.toString(),
        title: auction.title,
        timestamp: auction.timestamp.toISOString(),
        createdBy: {
          id: createdBy._id.toString(),
          username: createdBy.username,
        },
      };
    });

    res.status(200).json({ auctions: responseData });
  } catch {
    res.status(500).json({ message: "Failed to fetch auction list" });
  }
};

export const getAuctionsFromCurrentUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized access" });
      return;
    }

    const auctions = await Auction.find({ createdBy: userId })
      .populate("createdBy")
      .sort({ timestamp: "descending" })
      .exec();

    const responseData = auctions.map((auction) => {
      const createdBy = auction.createdBy as unknown as UserDocument;
      return {
        id: auction._id.toString(),
        title: auction.title,
        timestamp: auction.timestamp.toISOString(),
        createdBy: {
          id: createdBy._id.toString(),
          username: createdBy.username,
        },
      };
    });

    res.status(200).json({ auctions: responseData });
  } catch {
    res.status(500).json({ message: "Failed to fetch auction list" });
  }
};
