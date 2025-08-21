import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.js";

const authRoute = express.Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
authRoute.post("/logout", logoutUser);

export default authRoute;
