import { Schema, model } from "mongoose";

const caseStudySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      required: true,
    },
    thumbnailPublicId: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    liveLink: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    prototype: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    blocks: {
      type: [Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const CaseStudy = model("CaseStudy", caseStudySchema);
