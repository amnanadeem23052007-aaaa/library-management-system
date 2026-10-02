import mongoose, { Schema } from "mongoose";

const IssueSchema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    returnDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["issued", "returned", "overdue"],
      default: "issued",
    },

    fine: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Issue =
  mongoose.models.Issue ||
  mongoose.model("Issue", IssueSchema);

export default Issue;