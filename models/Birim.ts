import mongoose, { Schema, type Document } from "mongoose";

export interface IBirim extends Document {
  ad: string;
  kisaltma: string;
  aktif: boolean;
  created_by: mongoose.Types.ObjectId;
}

const BirimSchema: Schema = new Schema(
  {
    ad: { type: String, required: true, unique: true },
    kisaltma: { type: String, required: true },
    aktif: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Birim =
  mongoose.models.Birim || mongoose.model<IBirim>("Birim", BirimSchema);

export default Birim;
