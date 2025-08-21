import express from "express";
import { createEvent, deleteEvent, getEvents } from "../controllers/event.js";
import { isAdmin, protect } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const eventRoute = express.Router();

eventRoute.get("/", getEvents);
eventRoute.post("/", protect, isAdmin, upload.single("photo"), createEvent);
eventRoute.delete("/:id", protect, isAdmin, deleteEvent);

export default eventRoute;
