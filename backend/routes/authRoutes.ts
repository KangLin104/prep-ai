import express, { Router } from "express";
import { registerUser, loginUser, getUserProfile} from "../controllers/authControllers";
import { protect } from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

export default router;
