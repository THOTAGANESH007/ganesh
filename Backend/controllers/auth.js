import User from "../models/user.js";
import generateToken from "../config/generateToken.js";

export const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ email, password, role });

    if (user) {
      const token = generateToken(res, user._id, user.role);
      console.log(email, password, role);
      res.status(201).json({
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
        token,
        message: "Registration successful!",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id, user.role);

      res.status(200).json({
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
        token,
        message: "Login successful!",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
