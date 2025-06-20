import mongoose, { Document, Schema, Model } from "mongoose";

// Define the interface for a Question document
export interface IQuestion {
  session: mongoose.Types.ObjectId;
  question?: string;
  answer?: string;
  note?: string;
  isPinned?: boolean;
}

// Extend with mongoose.Document for full typing
export interface IQuestionDocument extends IQuestion, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const questionSchema: Schema<IQuestionDocument> = new Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    note: {
      type: String,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const Question: Model<IQuestionDocument> = mongoose.model<IQuestionDocument>("Question", questionSchema);

export default Question;
