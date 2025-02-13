import mongoose, { type Document, Schema } from "mongoose";

export interface ISezon extends Document {
  ad: string;
  baslangic_tarihi: Date;
  bitis_tarihi: Date;
  created_by: mongoose.Types.ObjectId;
}

const SezonSchema: Schema = new Schema(
  {
    ad: { type: String, required: true },
    baslangic_tarihi: { type: Date, required: true },
    bitis_tarihi: { type: Date, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "Sahip", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Sezon ||
  mongoose.model<ISezon>("Sezon", SezonSchema);
