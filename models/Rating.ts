import mongoose, { Schema } from "mongoose";

const RatingSchema = new Schema(
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

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

RatingSchema.index({ book: 1, member: 1 }, { unique: true });

const Rating =
  mongoose.models.Rating || mongoose.model("Rating", RatingSchema);

export default Rating;
