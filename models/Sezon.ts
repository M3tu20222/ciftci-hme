import mongoose, { type Document, Schema } from "mongoose";

export interface ISezon extends Document {
  ad: string;
  baslangic_tarihi: Date;
  bitis_tarihi: Date;
  aktif: boolean;
  created_by: mongoose.Types.ObjectId;
}

const SezonSchema: Schema = new Schema(
  {
    ad: { type: String, required: true },
    baslangic_tarihi: { type: Date, required: true },
    bitis_tarihi: { type: Date, required: true },
    aktif: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Changed from Sahip to User
  },
  { timestamps: true }
);

// Ensure model hasn't been compiled yet
const Sezon =
  mongoose.models.Sezon || mongoose.model<ISezon>("Sezon", SezonSchema);

export default Sezon;
