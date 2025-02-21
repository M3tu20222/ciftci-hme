import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IGenelBorc extends Document {
  borclu_id: mongoose.Types.ObjectId;
  alacakli_id: mongoose.Types.ObjectId;
  borc_tipi: "PARA" | "URUN" | "KREDI" | "KISISEL" | "DIGER";
  odeme_durumu: "Bekliyor" | "Kısmi Ödendi" | "Ödendi";
  vade_tarihi: Date;
  notlar: string;
  created_by: mongoose.Types.ObjectId;
}

export interface IParaBorc extends IGenelBorc {
  tutar: number;
  para_birimi: "TRY" | "ALTIN";
}

export interface IUrunBorc extends IGenelBorc {
  urun_tipi: "MAZOT" | "GUBRE" | "TOHUM" | "DIGER";
  miktar: number;
  birim: "LT" | "KG" | "CUVAL" | "ADET";
  birim_fiyat: number;
}

export interface IKrediBorc extends IGenelBorc {
  kredi_tutari: number;
  odenecek_tutar: number;
  faiz_orani: number;
  taksit_sayisi?: number;
  taksit_cesidi: "AYLIK" | "YILLIK";
}

export interface IKisiselBorc extends IGenelBorc {
  tutar: number;
  odeme_tipi: "HAVALE" | "EFT" | "KREDI" | "KREDI_KARTI";
}

export interface IDigerBorc extends IGenelBorc {
  aciklama: string;
  tutar: number;
}

const GenelBorcSchema = new Schema(
  {
    borclu_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    alacakli_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    borc_tipi: {
      type: String,
      required: true,
      enum: ["PARA", "URUN", "KREDI", "KISISEL", "DIGER"],
    },
    odeme_durumu: {
      type: String,
      required: true,
      enum: ["Bekliyor", "Kısmi Ödendi", "Ödendi"],
    },
    vade_tarihi: { type: Date, required: true },
    notlar: { type: String, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, discriminatorKey: "borc_tipi" }
);

const ParaBorcSchema = new Schema({
  tutar: { type: Number, required: true },
  para_birimi: { type: String, required: true, enum: ["TRY", "ALTIN"] },
});

const UrunBorcSchema = new Schema({
  urun_tipi: {
    type: String,
    required: true,
    enum: ["MAZOT", "GUBRE", "TOHUM", "DIGER"],
  },
  miktar: { type: Number, required: true },
  birim: { type: String, required: true, enum: ["LT", "KG", "CUVAL", "ADET"] },
  birim_fiyat: { type: Number, required: true },
});

const KrediBorcSchema = new Schema({
  kredi_tutari: { type: Number, required: true },
  odenecek_tutar: { type: Number, required: true },
  faiz_orani: { type: Number, required: true },
  taksit_sayisi: Number,
  taksit_cesidi: { type: String, required: true, enum: ["AYLIK", "YILLIK"] },
});

const KisiselBorcSchema = new Schema({
  tutar: { type: Number, required: true },
  odeme_tipi: {
    type: String,
    required: true,
    enum: ["HAVALE", "EFT", "KREDI", "KREDI_KARTI"],
  },
});

const DigerBorcSchema = new Schema({
  aciklama: { type: String, required: true },
  tutar: { type: Number, required: true },
});

let GenelBorc: Model<IGenelBorc>;
let ParaBorc: Model<IParaBorc>;
let UrunBorc: Model<IUrunBorc>;
let KrediBorc: Model<IKrediBorc>;
let KisiselBorc: Model<IKisiselBorc>;
let DigerBorc: Model<IDigerBorc>;

if (mongoose.models.GenelBorc) {
  GenelBorc = mongoose.models.GenelBorc as Model<IGenelBorc>;
  ParaBorc = mongoose.models.PARA as Model<IParaBorc>;
  UrunBorc = mongoose.models.URUN as Model<IUrunBorc>;
  KrediBorc = mongoose.models.KREDI as Model<IKrediBorc>;
  KisiselBorc = mongoose.models.KISISEL as Model<IKisiselBorc>;
  DigerBorc = mongoose.models.DIGER as Model<IDigerBorc>;
} else {
  GenelBorc = mongoose.model<IGenelBorc>("GenelBorc", GenelBorcSchema);
  ParaBorc = GenelBorc.discriminator<IParaBorc>("PARA", ParaBorcSchema);
  UrunBorc = GenelBorc.discriminator<IUrunBorc>("URUN", UrunBorcSchema);
  KrediBorc = GenelBorc.discriminator<IKrediBorc>("KREDI", KrediBorcSchema);
  KisiselBorc = GenelBorc.discriminator<IKisiselBorc>(
    "KISISEL",
    KisiselBorcSchema
  );
  DigerBorc = GenelBorc.discriminator<IDigerBorc>("DIGER", DigerBorcSchema);
}

export { GenelBorc, ParaBorc, UrunBorc, KrediBorc, KisiselBorc, DigerBorc };
