import mongoose, { type Document, type Model } from "mongoose";
import type { IUser } from "./User";

export interface IInvoice {
  _id: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  amount: number;
  createdBy?: IUser["_id"]; // Make createdBy optional
}

export interface IWell extends Document {
  name: string;
  location: string;
  depth: number;
  capacity: number;
  lastInvoiceDate?: Date;
  invoices: IInvoice[];
}

const invoiceSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const wellSchema = new mongoose.Schema<IWell>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    depth: { type: Number, required: true },
    capacity: { type: Number, required: true },
    lastInvoiceDate: { type: Date },
    invoices: [invoiceSchema],
  },
  { timestamps: true }
);

export const Well: Model<IWell> =
  mongoose.models.Well || mongoose.model<IWell>("Well", wellSchema);
