import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";

export interface IStory extends Document {
  user: ObjectId;
  image: string;
  createdAt: Date;
}

const StorySchema = new Schema<IStory>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 86400 },
  },
  { timestamps: true }
);

export const Story: Model<IStory> =
  mongoose.models.Story || mongoose.model<IStory>("Story", StorySchema);
