import mongoose, { Schema, models, model } from "mongoose";

const DeletedBookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    isbn: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    available: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.DeletedBook ||
  model("DeletedBook", DeletedBookSchema);