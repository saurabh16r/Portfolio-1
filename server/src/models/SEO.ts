import { Schema, model } from "mongoose";

const seoSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "site-seo",
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SEO = model("SEO", seoSchema);
