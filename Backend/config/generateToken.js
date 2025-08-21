import jwt from "jsonwebtoken";

const generateToken = (res, userId, userRole) => {
  const token = jwt.sign(
    { userId, role: userRole }, // The payload containing user info
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // Set JWT as an HTTP-Only cookie for security
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "production", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token; // Also return the token for API clients that don't use cookies
};

export default generateToken;
