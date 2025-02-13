import mongoose, { type Document, type Model } from "mongoose";

export interface IInvoice extends Document {
  wellId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  amount: number;
  createdBy: mongoose.Types.ObjectId;
}

const invoiceSchema = new mongoose.Schema<IInvoice>(
  {
    wellId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Well",
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", invoiceSchema);
