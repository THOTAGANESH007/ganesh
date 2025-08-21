import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    photo: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
