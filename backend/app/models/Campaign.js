import mongoose from "mongoose";
import UserModel from "./User.js";
import commentSchema from "./CommentSchema.js";

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
    // ownerName: {
    //   type: String,
    //   required: true,
    // },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    owners: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: String, required: true },
        permissions: { type: [String], required: true },
      },
    ],
    metrics: {
      impressions: {
        type: Number,
        default: 0,
      },
      clicks: {
        type: Number,
        default: 0,
      },
      conversions: {
        type: Number,
        default: 0,
      },
      averageOrderValue: {
        type: Number,
        default: 0,
      },
    },
    community: {
      blogs: [
        {
          title: {
            type: String,
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
          metrics: {
            views: { type: Number, default: 0 },
            likes: { type: Number, default: 0 },
            shares: { type: Number, default: 0 },
          },
          comments: [commentSchema], // Use the CommentSchema here
        },
      ],
    },
    milestone: {
      target: {
        type: String,
        //required: true
      },
      progress: {
        type: String,
        //required: true
      },
      backers: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          amount: Number,
          date: {
            type: Date,
            default: Date.now,
          },
          isPublic: {
            // Whether backer wants to be publicly listed
            type: Boolean,
            default: true,
          },
        },
      ],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "technology",
        "art",
        "film",
        "music",
        "games",
        "publishing",
        "fashion",
        "food",
        "technology",
        "art",
        "film",
        "music",
        "games",
        "publishing",
        "fashion",
        "food",
        "education",
        "nonprofit",
        "social_cause",
        "environment",
        "health",
        "community",
        "other",
      ],
    },
    subcategory: {
      type: String,
      required: true,
    },
    payments: {
      count: {
        type: String,
        //required: true
      },
    },
    budget: {
      total: {
        type: Number,
        required: true, // Total allocated budget for the campaign
      },
      spent: {
        type: Number,
        default: 0, // Amount spent so far
      },
      expenses: [
        {
          // Detailed tracking of where money is spent
          amount: {
            type: Number,
            required: true,
          },
          description: String,
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      dailyLimit: {
        // Optional daily spending limit
        type: Number,
        default: null,
      },
    },
  },
  {
    versionKey: false,
  }
);

const campaignModel = mongoose.model("Campaign", CampaignSchema);

export default campaignModel;
