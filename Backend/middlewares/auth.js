import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware: protect routes (requires valid JWT)
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from cookies
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // 2. Or from Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3. If no token found
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user to request (without password field)
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    next(); // move to next middleware
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware: only allow admins
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};
