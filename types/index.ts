import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export interface User {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  followers: string[] | ObjectId[];
  following: string[] | ObjectId[];
}

export interface Comment {
  _id: mongoose.Types.ObjectId;
  user: User;
  content: string;
  createdAt: Date;
}

export interface Post {
  _id: mongoose.Types.ObjectId;
  user: any;
  content: string;
  media?: string;
  isReel: boolean;
  likes: string[] | ObjectId[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
