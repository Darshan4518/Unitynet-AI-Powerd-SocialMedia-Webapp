"use client";

import {
  followUser,
  getProfile,
  unfollowUser,
} from "@/lib/actions/userActions";
import mongoose from "mongoose";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface FollowType {
  userId: mongoose.Types.ObjectId;
  targetUserId: string;
  className?: string;
}

export default function FollowButton({
  userId,
  targetUserId,
  className,
}: FollowType) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkIfFollowing = async () => {
      const { user } = await getProfile(userId);
      if (user?.following?.includes(targetUserId)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    };
    checkIfFollowing();
  }, [userId, targetUserId]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        const { success } = await unfollowUser(targetUserId);
        if (success) {
          setIsFollowing(false);
          toast.success("Unfollowed user");
        } else {
          toast.error("Failed to unfollow user");
        }
      } else {
        const { success } = await followUser(targetUserId);
        if (success) {
          setIsFollowing(true);
          toast.success("Followed user");
        } else {
          toast.error("Failed to follow user");
        }
      }
    } catch (error: any) {
      toast.error("Error following/unfollowing user:", error?.message);
    }
  };

  return (
    <Button
      variant={"ghost"}
      onClick={handleFollow}
      className={`px-3 py-2 rounded text-xs ${
        isFollowing ? "bg-gray-200 text-gray-800" : "bg-blue-500 text-white"
      } ${className}`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
