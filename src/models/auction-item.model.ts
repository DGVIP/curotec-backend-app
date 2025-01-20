import { HydratedDocument, Schema, model } from "mongoose";

export interface IAuctionItem {
  title: string;
  startPrice: number;
  currentBid: number;
  startTime: Date;
  endTime: Date;
  createdBy: Schema.Types.ObjectId;
  bidHistory: Schema.Types.ObjectId[];
  auction: Schema.Types.ObjectId;
}

export type AuctionItemDocument = HydratedDocument<IAuctionItem>;

const auctionItemSchema = new Schema<IAuctionItem>({
  title: {
    type: String,
    required: true,
  },
  startPrice: {
    type: Number,
    required: true,
  },
  currentBid: {
    type: Number,
    default: 0,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bidHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Bid",
    },
  ],
  auction: {
    type: Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
});

export const AuctionItem = model<IAuctionItem>(
  "AuctionItem",
  auctionItemSchema
);
