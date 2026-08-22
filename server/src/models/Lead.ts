import { Schema, model } from "mongoose";

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    company: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    budget: {
      type: String,
      required: true,
    },
    timeline: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sourcePage: {
      type: String,
      default: "Contact",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "follow-up", "proposal-sent", "won", "lost", "archived"],
      default: "new",
    },
    notes: {
      type: [String],
      default: [],
    },
    submittedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Lead = model("Lead", leadSchema);
