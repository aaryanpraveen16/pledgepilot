import mongoose from "mongoose";
import UserModel from "./User.js";

const Schema = mongoose.Schema;

const CampaignSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    community: {
      comment: {
        id: { type: String },
        body: { type: String },
        owner: { userId: { type: String } },
      },
      blog: {
        id: { type: String },
        body: { type: String },
        owner: { userId: { type: String } },
      },
    },
    milestone: {
      target: { type: String },
      progress: { type: String },
    },
    payments: {
      count: { type: String },
    },
    category: {
      type: String,
      default: "Tech",
    },
    image: {
      type: String,
    },
    daysLeft: {
      type: Number,
      default: 30,
    },
    badge: {
      type: String,
    },
    rewards: {
      type: Array,
      default: [],
    },
  },
  {
    versionKey: false,
    strict: false,
  }
);

const campaignModel = mongoose.model("Campaign", CampaignSchema);

export default campaignModel;
