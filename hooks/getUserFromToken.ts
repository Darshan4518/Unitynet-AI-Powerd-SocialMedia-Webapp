"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { toast } from "sonner";

interface IUserToken {
  id: mongoose.Types.ObjectId;
  email: string;
  exp: number;
}

// Validate the presence of the JWT_SECRET environment variable
if (!process.env.JWT_SECRET) {
  throw new Error("The environment variable JWT_SECRET is not defined");
}

export async function getUserFromToken(): Promise<IUserToken> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");

  if (!token?.value) {
    toast.error("Authentication token is missing or invalid");
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET!
    ) as IUserToken;

    if (decoded.exp * 1000 < Date.now()) {
      redirect("/login");
    }

    return decoded;
  } catch (error) {
    redirect("/login");
  }
}
