import express, { Router } from "express";
import {
  addQuestionToSession,
  togglePinQuestion,
  updateQuesitonNote,
} from "../controllers/questionControllers";
import { protect } from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("/add", protect, addQuestionToSession);
router.post("/:id/pin", protect, togglePinQuestion);
router.post("/:id/note", protect, updateQuesitonNote);

export default router;
