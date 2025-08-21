import Event from "../models/event.js";
import { cloudinary } from "../config/cloudinary.js";
import { handleCloudinaryUpload } from "../config/cloudinaryHelper.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description } = req.body;
    const photoFile = req.file;

    if (!description || !photoFile || !title) {
      return res
        .status(400)
        .json({ message: "Description and photo are required." });
    }

    // Upload to Cloudinary and save to DB
    const result = await handleCloudinaryUpload(photoFile.buffer, "events");

    const newEvent = await Event.create({
      title,
      description,
      photo: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(201).json({
      message: "Event created successfully.",
      event: newEvent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve events." });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    await event.deleteOne();
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
