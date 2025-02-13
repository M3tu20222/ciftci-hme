import mongoose, { Schema, type Document } from "mongoose";

export interface IGubreStok extends Document {
  gubre: mongoose.Types.ObjectId;
  miktar: number;
  birim: string;
  alisTarihi: Date;
  sonKullanmaTarihi: Date;
  fiyat: number;
  created_by: mongoose.Types.ObjectId;
}

const GubreStokSchema: Schema = new Schema(
  {
    gubre: { type: Schema.Types.ObjectId, ref: "Gubre", required: true },
    miktar: { type: Number, required: true },
    birim: { type: String, required: true },
    alisTarihi: { type: Date, required: true },
    sonKullanmaTarihi: { type: Date, required: true },
    fiyat: { type: Number, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.GubreStok ||
  mongoose.model<IGubreStok>("GubreStok", GubreStokSchema);
