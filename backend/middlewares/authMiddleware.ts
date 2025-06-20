import { NextFunction, Response } from "express";
import Jwt from "jsonwebtoken";
import User from "../models/User";
import { RequestWithUser } from "../models/User";

const protect = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];
      const decoded: any = Jwt.verify(token, process.env.JWT_SECRET || "");

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error: any) {
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};

export { protect };
