import mongoose, { Document, Schema, Model } from "mongoose";

// Define the interface for the Session document
export interface ISession {
  user: mongoose.Types.ObjectId;
  role: string;
  experience: string;
  topicToFocus: string;
  description?: string;
  questions: mongoose.Types.ObjectId[];
}

// Extend the interface with mongoose.Document
export interface ISessionDocument extends ISession, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const sessionSchema: Schema<ISessionDocument> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    topicToFocus: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Export the model with typing
const Session: Model<ISessionDocument> = mongoose.model<ISessionDocument>("Session", sessionSchema);

export default Session;
