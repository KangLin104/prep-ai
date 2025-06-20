import { Response } from "express";
import { RequestWithUser } from "../models/User";
import Session from "../models/Session";
import Question, {IQuestion} from "../models/Question";

//@description create a new session
//@route POST /api/sessions/create
//@access Private
export const createSession = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  try {
    const { role, experience, topicToFocus, description, questions } = req.body;

    const userId = req.user?._id;


    const session = await Session.create({
        user: userId,
        role,
        experience,
        topicToFocus,
        description,
      });
  
    const questionDocs = await Promise.all(
    questions.map(async (q: IQuestion) => {
        const question = await Question.create({
        session: session._id,
        question: q.question,
        answer: q.answer,
        });
        return question._id;
    })
    );

    session.questions = questionDocs;
    await session.save();

    res.status(201).json({ sucess: true, session });


  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@description get all session
//@route GET /api/sessions/my-sessions
//@access Private
export const getMySession = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  try {
    const sessions = await Session.find({ user: req.user?._id })
    .sort({ createdAt: -1 })
    .populate("questions")

    res.status(200).json({sessions });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@description get a session by id
//@route GET /api/sessions/:id
//@access Private
export const getSessionById = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  try {
    const sessions = await Session.findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: -1 } },
      })
      .exec();

    if (!sessions) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ sucess: true, session: sessions });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@description delete a session
//@route DELETE /api/sessions/:id
//@access Private

export const deleteSession = async (
  req: RequestWithUser,
  res: Response
): Promise<any> => {
  try {
    const sessions = await Session.findById(req.params.id);

    if (!sessions) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (sessions.user.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this session" });
    }

    await Question.deleteMany({ session: sessions._id });
    await sessions.deleteOne();
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
