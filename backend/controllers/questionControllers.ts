import { Request, Response } from "express";
import { RequestWithUser } from "../models/User";
import Session from "../models/Session";
import Question, { IQuestion } from "../models/Question";

//@description add question to session
//@route POST /api/questions/add
//@access Private

export const addQuestionToSession = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    
    const { sessionID, questions } = req.body;
    if (!sessionID || !questions || !Array.isArray(questions)) {
      return res
        .status(400)
        .json({ message: "Session ID and questions are required" });
    }

    const session = await Session.findById(sessionID);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const createdQuestions = await Promise.all(
      questions.map(
        async (q: IQuestion) =>
          await Question.create({
            session: sessionID,
            question: q.question,
            answer: q.answer,
          })
      )
    );
    session.questions.push(...createdQuestions.map((q) => q._id as any));
    await session.save();

    res.status(201).json({ success: true, session });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@description toggle pin question
//@route POST /api/questions/:id/pin
//@access Private

export const togglePinQuestion = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    question.isPinned = !question.isPinned;
    await question.save();
    res.status(200).json({ success: true, question });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@description update question note
//@route POST /api/questions/:id/note
//@access Private

export const updateQuesitonNote = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { note } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }
    question.note = note;
    await question.save();
    res.status(200).json({ success: true, question });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
