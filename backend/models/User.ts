import { Request } from "express";
import mongoose, { Document, Schema, Model } from "mongoose";


export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {
    _id: mongoose.Types.ObjectId;
}

export interface RequestWithUser extends Request {
    user?: IUserDocument;
  }

const userSchema: Schema<IUserDocument> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User: Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema);

export default User;
