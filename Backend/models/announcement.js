import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    timeAndDate: {
      type: Date,
      required: [true, "Time and date are required."],
    },
    description: {
      type: String,
      trim: true,
      // Not required, so no 'required' property
    },
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
