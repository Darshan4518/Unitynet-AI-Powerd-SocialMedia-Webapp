"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "@/models/User";
import { Post } from "@/models/Post";
import { getUserFromToken } from "@/hooks/getUserFromToken";
import mongoose from "mongoose";
import cloudinary from "../cloudinary";

// Ensure JWT_SECRET is available at runtime
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/**
 * Utility to upload images to Cloudinary.
 */
async function uploadImage(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64Media = Buffer.from(buffer).toString("base64");
  const dataURI = `data:${file.type};base64,${base64Media}`;

  try {
    const result = await cloudinary.uploader.upload(dataURI);
    return result.secure_url;
  } catch (error) {
    throw new Error("Failed to upload image.");
  }
}

/**
 * Sign-up new users.
 */
export async function signUp(
  formData: FormData
): Promise<{ message: string; success: boolean }> {
  const name = formData.get("name") as string;
  const userName = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }

  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    userName,
    password: hashedPassword,
  });

  await newUser.save();
  revalidatePath("/");
  return { message: "Account created successfully.", success: true };
}

/**
 * Sign-in users and generate an auth token.
 */
export async function signIn(
  formData: FormData
): Promise<{ message: string; success?: boolean }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { message: "Email and password are required." };
  }

  await dbConnect();

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return { message: "Invalid email or password." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { message: "Invalid email or password." };
  }

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const cookieStore = await cookies();
  cookieStore.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return { message: "Login successful.", success: true };
}

/**
 * Sign-out users by clearing the auth token.
 */
export async function signOut(): Promise<{ message: string }> {
  const cookieStore = await cookies();
  cookieStore.set("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return { message: "Logged out successfully." };
}

/**
 * Fetch all users except the current user.
 */
export async function getUsers() {
  const { id } = await getUserFromToken();

  await dbConnect();

  const users = await User.find()
    .sort({ createdAt: -1 })
    .select("userName _id image");

  const filteredUsers = users.filter(
    (user) => user._id.toString() !== id.toString()
  );

  return { users: JSON.parse(JSON.stringify(filteredUsers)) };
}

/**
 * Follow another user.
 */
export async function followUser(targetUserId: string): Promise<{
  success: boolean;
}> {
  const { id } = await getUserFromToken();

  if (!id || !targetUserId) {
    throw new Error("User IDs are required.");
  }

  await dbConnect();

  const [user, targetUser] = await Promise.all([
    User.findById(id),
    User.findById(new mongoose.Types.ObjectId(targetUserId)),
  ]);

  if (!user || !targetUser) {
    throw new Error("User not found.");
  }

  if (!user.following.includes(targetUser._id)) {
    await Promise.all([
      User.findByIdAndUpdate(id, { $addToSet: { following: targetUser._id } }),
      User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: user._id },
      }),
    ]);
  }
  revalidatePath(`/profile/${targetUserId}`);
  return {
    success: true,
  };
}

/**
 * Unfollow another user.
 */
export async function unfollowUser(
  targetUserId: string
): Promise<{ success: boolean }> {
  const { id } = await getUserFromToken();

  if (!id || !targetUserId) {
    throw new Error("User IDs are required.");
  }

  await dbConnect();

  const [user, targetUser] = await Promise.all([
    User.findById(id),
    User.findById(new mongoose.Types.ObjectId(targetUserId)),
  ]);

  if (!user || !targetUser) {
    throw new Error("User not found.");
  }

  await Promise.all([
    User.findByIdAndUpdate(id, { $pull: { following: targetUser._id } }),
    User.findByIdAndUpdate(targetUserId, { $pull: { followers: user._id } }),
  ]);

  revalidatePath(`/profile/${targetUserId}`);
  return {
    success: true,
  };
}

/**
 * Fetch a user's profile and their posts.
 */
export async function getProfile(id: mongoose.Types.ObjectId) {
  await dbConnect();

  const [user, posts] = await Promise.all([
    User.findById(id),
    Post.find({ user: id }).sort({ createdAt: -1 }).limit(10),
  ]);

  return {
    user: JSON.parse(JSON.stringify(user)),
    posts: JSON.parse(JSON.stringify(posts)),
  };
}

/**
 * Update user profile details.
 */
export async function updateProfile(
  formData: FormData
): Promise<{ message: string; success: boolean }> {
  const { id } = await getUserFromToken();

  if (!id) {
    throw new Error("Unauthorized access.");
  }

  const name = formData.get("name") as string;
  const userName = formData.get("username") as string;
  const email = formData.get("email") as string;
  const imageFile = formData.get("image");
  const bio = formData.get("bio") as string;
  const gender = formData.get("gender") as string;
  const link = formData.get("link") as string;

  let imageUrl = "";

  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile);
  }

  await dbConnect();

  const updateData: Record<string, any> = {
    name,
    email,
    userName,
    bio,
    gender,
    link,
  };

  if (imageUrl) {
    updateData.image = imageUrl;
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found or failed to update.");
  }

  revalidatePath("/profile/editprofile");
  return { message: "Profile updated successfully.", success: true };
}

export async function searchUser(query: string) {
  if (!query) {
    throw new Error("Search query cannot be empty.");
  }
  const { id } = await getUserFromToken();

  await dbConnect();

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { userName: { $regex: query, $options: "i" } },
    ],
  });

  const searchedUsers = users.filter(
    (user) => user?._id.toString() !== id.toString()
  );

  return { users: JSON.parse(JSON.stringify(searchedUsers)) };
}
