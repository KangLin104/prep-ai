import express, { Router } from "express";
import {
  createSession,
  getMySession,
  getSessionById,
  deleteSession,
} from "../controllers/sessionControllers";
import { protect } from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySession);
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSession);

export default router;


