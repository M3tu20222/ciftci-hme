import mongoose, { type Document, type Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "ortak" | "işçi";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "ortak", "işçi"],
      default: "işçi",
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
