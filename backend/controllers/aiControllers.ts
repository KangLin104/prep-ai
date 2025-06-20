import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";
import { questionAnswerPrompt, conceptExplainPrompts } from "../utils/prompts";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateInterviewQuestions = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { role, experience, topicToFocus, numberOfQuestion } = req.body;

    if (!role || !experience || !topicToFocus || !numberOfQuestion) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicToFocus,
      numberOfQuestion
    );

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    const cleanText = (rawText ?? "")
      .replace(/```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON.parse(cleanText);
    res.status(200).json(data);
  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@description generate conecpt explanation
//@route POST /api/ai/generate-explanation
//@access Private
export const generateConecptExplanation = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Missing required fields" });
        }
      const prompt = conceptExplainPrompts(question);

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text();

      const cleanText = (rawText ?? "")
      .replace(/```json\s*/, "")
      .replace(/```$/, "")
      .trim();

      const data = JSON.parse(cleanText);
      res.status(200).json(data);


    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
};