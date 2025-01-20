import { HydratedDocument, Schema, model } from "mongoose";

interface IAuction {
  title: string;
  createdBy: Schema.Types.ObjectId;
  timestamp: Date;
  items: Schema.Types.ObjectId[];
}

export type AuctionDocument = HydratedDocument<IAuction>;

const auctionSchema = new Schema<IAuction>({
  title: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "AuctionItem",
    },
  ],
});

export const Auction = model<IAuction>("Auction", auctionSchema);
