import { handleCloudinaryUpload } from "../config/cloudinaryHelper.js";
import Coordinator from "../models/coordinator.js";

// GET all coordinators
export const getCoordinators = async (req, res) => {
  try {
    const coordinators = await Coordinator.find({}).sort({ createdAt: "asc" });
    res.status(200).json(coordinators);
  } catch (error) {
    console.error("GET Coordinators Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// POST a new coordinator (Admin only)
export const createCoordinator = async (req, res) => {
  try {
    const { name } = req.body;
    const photoFile = req.file;

    if (!name || !photoFile) {
      return res.status(400).json({ message: "Name and photo are required." });
    }

    const result = await handleCloudinaryUpload(
      photoFile.buffer,
      "coordinators"
    );

    const newCoordinator = await Coordinator.create({
      name,
      photo: {
        public_id: result.public_id,
        url: result.secure_url,
        alt: `Photo of ${name}`,
      },
    });

    res.status(201).json({
      message: "Coordinator added successfully.",
      coordinator: newCoordinator,
    });
  } catch (error) {
    console.error("CREATE Coordinator Error:", error);
    // This is the error you were seeing.
    res.status(400).json({
      message: "Invalid data provided. Please check the model schema.",
      error: error.message,
    });
  }
};

// DELETE a coordinator (Admin only)
export const deleteCoordinator = async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.params.id);
    if (!coordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }
    await coordinator.deleteOne();
    res.status(200).json({ message: "Coordinator deleted successfully" });
  } catch (error) {
    console.error("DELETE Coordinator Error:", error);
    res.status(500).json({ message: "Server Error during deletion" });
  }
};
