import Announcement from "../models/announcement.js";
export const createAnnouncement = async (req, res) => {
  try {
    const { title, timeAndDate, description } = req.body;

    if (!title || !timeAndDate) {
      return res
        .status(400)
        .json({ message: "Title and time/date are required." });
    }

    const newAnnouncement = await Announcement.create({
      title,
      timeAndDate,
      description,
    });

    res.status(201).json({
      message: "Announcement created successfully.",
      announcement: newAnnouncement,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ timeAndDate: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve announcements." });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement)
      return res.status(404).json({ message: "Announcement not found" });
    await announcement.deleteOne();
    res.status(200).json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
