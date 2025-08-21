import express from "express";
import { createMedia, deleteMedia, getMedia } from "../controllers/media.js";
import { isAdmin, protect } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const mediaRoute = express.Router();

mediaRoute.get("/", getMedia);
mediaRoute.post("/", protect, isAdmin, upload.single("photo"), createMedia);
mediaRoute.delete("/:id", protect, isAdmin, deleteMedia);
export default mediaRoute;
