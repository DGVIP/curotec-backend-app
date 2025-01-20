import { connect } from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

export const connectToDatabase = async () => {
  await connect(DATABASE_URL);
};
