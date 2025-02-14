import mongoose, { type Document, Schema } from "mongoose";

export interface IKategori extends Document {
  ad: string;
  ust_kategori_id: mongoose.Types.ObjectId | null;
}

const KategoriSchema: Schema = new Schema(
  {
    ad: { type: String, required: true },
    ust_kategori_id: {
      type: Schema.Types.ObjectId,
      ref: "Kategori",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Kategori ||
  mongoose.model<IKategori>("Kategori", KategoriSchema);
