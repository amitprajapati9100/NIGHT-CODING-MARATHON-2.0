import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ensureDatabaseConnection } from "../config/database-config.js";
import { sendServerError } from "../utils/error-response-util.js";

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "development-secret",
    { expiresIn: "7d" },
  );
};

const getAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id),
});

export const registerUser = async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const trimmedName = name?.trim();

    if (!trimmedName || !normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const userExists = await User.findOne({ email: normalizedEmail }).lean().exec();

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json(getAuthResponse(user));
  } catch (error) {
    return sendServerError(res, error, error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: normalizedEmail }).exec();

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json(getAuthResponse(user));
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    return sendServerError(res, error, error.message);
  }
};

export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};
