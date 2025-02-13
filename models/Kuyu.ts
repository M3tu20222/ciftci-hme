import mongoose, { type Document, Schema } from "mongoose";

export interface IKuyu extends Document {
  ad: string;
  bolge: string;
  konum: string;
  derinlik: number;
  kapasite: number;
  durum: string;
  sezon_id: mongoose.Types.ObjectId;
  created_by: mongoose.Types.ObjectId;
}

const KuyuSchema: Schema = new Schema(
  {
    ad: { type: String, required: true },
    bolge: { type: String, required: true },
    konum: { type: String, required: true },
    derinlik: { type: Number, required: true },
    kapasite: { type: Number, required: true },
    durum: { type: String, required: true },
    sezon_id: { type: Schema.Types.ObjectId, ref: "Sezon", required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Kuyu ||
  mongoose.model<IKuyu>("Kuyu", KuyuSchema);
