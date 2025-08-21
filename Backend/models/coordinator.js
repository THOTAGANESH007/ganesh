import mongoose from "mongoose";

const coordinatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the coordinator's name"],
      trim: true,
    },
    photo: {
      // This public_id is essential for deleting the image from Cloudinary
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      alt: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Coordinator = mongoose.model("Coordinator", coordinatorSchema);
export default Coordinator;
