import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import announcementRoute from "./routes/announcementRoutes.js";
import eventRoute from "./routes/eventRoutes.js";
import mediaRoute from "./routes/mediaRoutes.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import CoordinatorRoute from "./routes/coordinatorRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Configure Cloudinary with credentials
configureCloudinary();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoute); //http://localhost:5000/api/auth
app.use("/api/announcements", announcementRoute); //http://localhost:5000/api/announcements
app.use("/api/events", eventRoute); //http://localhost:5000/api/events
app.use("/api/media", mediaRoute); //http://localhost:5000/api/media
app.use("/api/coordinators", CoordinatorRoute); //http://localhost:5000/api/coordinators

// Start the server
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err.message);
  });
