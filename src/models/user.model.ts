import { Schema, model, HydratedDocument } from "mongoose";

export interface IUser {
  username: string;
  password: string;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = model<IUser>("User", userSchema);
