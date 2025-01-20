import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import { User } from "@/models/user.model";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Username is already taken." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

interface TokenPayload {
  id: string;
  username: string;
}

const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const payload: TokenPayload = {
      id: user.id,
      username: user.username,
    };

    const accessToken = generateAccessToken(payload);

    res.status(200).json({ message: "Login successful.", accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};
