import Media from "../models/media.js";
import { handleCloudinaryUpload } from "../config/cloudinaryHelper.js";

export const createMedia = async (req, res) => {
  try {
    const { title, description } = req.body;
    const photoFile = req.file;

    if (!description || !photoFile || !title) {
      return res
        .status(400)
        .json({ message: "Description and photo are required." });
    }

    // Upload to Cloudinary and save to DB
    const result = await handleCloudinaryUpload(photoFile.buffer, "media");

    const newMedia = await Media.create({
      title,
      description,
      photo: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(201).json({
      message: "Media item created successfully.",
      media: newMedia,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// @desc    Get all media (Public)
// @route   GET /api/media
export const getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve media." });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const mediaItem = await Media.findById(req.params.id);
    if (!mediaItem) return res.status(404).json({ message: "Media not found" });
    await mediaItem.deleteOne();
    res.status(200).json({ message: "Media deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
