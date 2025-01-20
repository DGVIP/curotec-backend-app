import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { Request, Response } from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import "./models/user.model";
import "./models/auction.model";
import "./models/auction-item.model";
import "./models/bid.model";

import { authRouter } from "./features/auth/auth.routes";
import { auctionsRouter } from "./features/auctions/auctions.routes";
import { connectToDatabase } from "./shared/utils/connect-to-database";
import { bidsRouter } from "./features/bids/bids.routes";

const main = async () => {
  await connectToDatabase();

  const app = express();
  const server = createServer(app);
  const io = new SocketIOServer(server, { cors: { origin: "*" } });
  const port = 3000;

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());

  io.once("connection", (socket) => {
    socket.on("create-auction", (data) => {
      socket.broadcast.emit("created-auction", data);
    });
  });

  app.get("/health-check", (_req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running." });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/auctions", auctionsRouter);
  app.use("/api/bids", bidsRouter);

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

main();
