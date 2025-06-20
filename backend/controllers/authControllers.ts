import { Request, Response } from "express";
import User, { RequestWithUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the return type of the function
const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//@description Register a new user
//@route POST /api/auth/register
//@access Public

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

//@description Login
//@route POST /api/auth/login
//@access Public

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    res.status(201).json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};

//@description get user profile
//@route GET /api/auth/profile
//@access Private
export const getUserProfile = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default generateToken;
