import express from "express";
import {
  getCoordinators,
  createCoordinator,
  deleteCoordinator,
} from "../controllers/coordinatorController.js";
import { isAdmin, protect } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const CoordinatorRoute = express.Router();

CoordinatorRoute.get("/", getCoordinators);
CoordinatorRoute.post(
  "/",
  protect,
  isAdmin,
  upload.single("photo"),
  createCoordinator
);

CoordinatorRoute.delete("/:id", protect, isAdmin, deleteCoordinator);

export default CoordinatorRoute;
