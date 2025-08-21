import express from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
} from "../controllers/announcement.js";
import { isAdmin, protect } from "../middlewares/auth.js";

const announcementRoute = express.Router();

announcementRoute.get("/", getAnnouncements);
announcementRoute.post("/", protect, isAdmin, createAnnouncement);
announcementRoute.delete("/:id", protect, isAdmin, deleteAnnouncement);

export default announcementRoute;
