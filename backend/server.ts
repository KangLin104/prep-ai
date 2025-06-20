import express, { Application } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import questionRoutes from "./routes/questonRoutes";
import { generateInterviewQuestions, generateConecptExplanation } from "./controllers/aiControllers";
import { protect } from "./middlewares/authMiddleware";


// Load environment variables
dotenv.config();

const app: Application = express();

app.use(cors(
    {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }
));

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConecptExplanation);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});