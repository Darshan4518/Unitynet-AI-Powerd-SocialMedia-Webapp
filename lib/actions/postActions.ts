"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { IPost, Post } from "@/models/Post";
import { getUserFromToken } from "@/hooks/getUserFromToken";
import { User } from "@/models/User";
import cloudinary from "../cloudinary";
import { Story } from "@/models/Story";

interface IComment {
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

interface FormDataWithFile extends FormData {
  get(name: string): string | File | null;
}

const MAX_VIDEO_SIZE_MB = 3;
const STORY_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Utility function to upload a file to Cloudinary.
 */
async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "video"
): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64Media = Buffer.from(buffer).toString("base64");
  const dataURI = `data:${file.type};base64,${base64Media}`;

  try {
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: resourceType,
    });
    return result.secure_url;
  } catch (error: any) {
    throw new Error(`Cloudinary upload failed: ${error?.message}`);
  }
}

/**
 * Function to create a post or reel.
 */
export async function createPostOrReel(
  formData: FormDataWithFile
): Promise<void> {
  const user = await getUserFromToken();
  if (!user) throw new Error("You must be logged in to create a post or reel");

  const content = formData.get("content") as string;
  const mediaFile = formData.get("media") as File;

  if (!mediaFile) throw new Error("Media file is required");

  const isReel = mediaFile.type.startsWith("video/");
  const folder = isReel ? "social_media_reels" : "social_media_posts";
  const mediaUrl = await uploadToCloudinary(
    mediaFile,
    folder,
    isReel ? "video" : "image"
  );

  if (isReel) {
    const sizeInMB = mediaFile.size / (1024 * 1024);
    if (sizeInMB > MAX_VIDEO_SIZE_MB) {
      throw new Error(
        `Video exceeds the maximum size of ${MAX_VIDEO_SIZE_MB} MB`
      );
    }
  }

  await dbConnect();
  const newPost: IPost = new Post({
    user: user.id,
    content,
    media: mediaUrl,
    isReel,
  });

  await newPost.save();
  revalidatePath("/");
}

/**
 * Function to fetch posts.
 */
export const getPosts = async (): Promise<{ data: IPost[] }> => {
  try {
    await dbConnect();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", model: User })
      .populate({
        path: "comments.user",
        model: User,
        select: "name image createdAt",
      })
      .populate({
        path: "likes",
        model: User,
        select: "name image createdAt",
      })
      .exec();

    return { data: JSON.parse(JSON.stringify(posts)) };
  } catch (error: any) {
    throw new Error("Failed to fetch posts");
  }
};

/**
 * Function to delete a user's post.
 */
export const deleteUserPost = async (
  postId: mongoose.Types.ObjectId
): Promise<{ message: string; success: boolean }> => {
  try {
    await dbConnect();
    await Post.findByIdAndDelete(postId);
    revalidatePath("/");
    return { message: "Post deleted successfully", success: true };
  } catch (error: any) {
    throw new Error("Failed to delete post");
  }
};

/**
 * Function to like or unlike a post.
 */
export async function likePost(
  postId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<{ success: boolean; message: string }> {
  if (!userId) throw new Error("You must be logged in to like a post");

  await dbConnect();

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  let message: string = "";
  let success: boolean = false;

  if (post.likes.includes(userId)) {
    await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    message = "Unliked post";
    success = true;
  } else {
    await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });
    message = "Liked post";
    success = true;
  }
  revalidatePath("/");
  return { success, message };
}

/**
 * Function to add a comment to a post.
 */
export async function addComment(
  postId: mongoose.Types.ObjectId,
  content: string
): Promise<{ success: true }> {
  try {
    const user = await getUserFromToken();
    if (!user) throw new Error("You must be logged in to comment");

    await dbConnect();
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const newComment: IComment = {
      user: user.id,
      content,
      createdAt: new Date(),
    };
    post.comments.push(newComment);
    await post.save();
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    throw new Error(" Failed to add comment");
  }
}

/**
 * Function to fetch reels.
 */
export const getReels = async (): Promise<{ data: IPost[] }> => {
  try {
    await dbConnect();
    const reels = await Post.find({ isReel: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({ path: "user", model: User, select: "userName image" })
      .exec();
    return { data: JSON.parse(JSON.stringify(reels)) };
  } catch (error: any) {
    throw new Error("Failed to fetch reels");
  }
};

/**
 * Function to fetch stories.
 */
export const getStories = async (): Promise<{ data: any[] }> => {
  try {
    await dbConnect();
    const stories = await Story.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", model: User, select: "name image" })
      .limit(10);
    return { data: JSON.parse(JSON.stringify(stories)) };
  } catch (error: any) {
    throw new Error("Failed to fetch stories");
  }
};

/**
 * Function to create a story.
 */
export async function createStory(
  formData: FormData
): Promise<{ success: boolean }> {
  const { id: userId } = await getUserFromToken();
  if (!userId) throw new Error("You must be logged in to create a story");

  const imageFile = formData.get("story") as File;
  if (!imageFile) throw new Error("Story image is required");

  const imageUrl = await uploadToCloudinary(
    imageFile,
    "social_media_stories",
    "image"
  );

  await dbConnect();
  const story = new Story({
    user: userId,
    image: imageUrl,
    createdAt: new Date(),
  });
  await story.save();

  // Automatically delete story after 24 hours
  setTimeout(async () => {
    await dbConnect();
    await Story.findByIdAndDelete(story._id);
  }, STORY_EXPIRATION_MS);

  revalidatePath("/");
  return { success: true };
}

/**
 * Function to delete a story.
 */
export const deleteStory = async (storyId: string): Promise<void> => {
  try {
    await dbConnect();
    await Story.findByIdAndDelete(storyId);
    revalidatePath("/");
  } catch (error: any) {
    throw new Error("Failed to delete story");
  }
};
