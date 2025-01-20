import { HydratedDocument, Schema, model } from "mongoose";

export interface IBid {
  amount: number;
  auctionItem: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  timestamp: Date;
}

export type BidDocument = HydratedDocument<IBid>;

const bidSchema = new Schema<IBid>({
  amount: {
    type: Number,
    required: true,
  },
  auctionItem: {
    type: Schema.Types.ObjectId,
    ref: "AuctionItem",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Bid = model<IBid>("Bid", bidSchema);
