"use client";

import React from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import mongoose from "mongoose";
import { likePost } from "@/lib/actions/postActions";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface LikeProps {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  postLikes: number;
  className?: string;
}

const LikeButton = ({ postId, userId, postLikes, className }: LikeProps) => {
  const handleLikes = async () => {
    try {
      const { success, message } = await likePost(postId, userId);
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.message(error?.message);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`rounded-full ${className}`}
      onClick={handleLikes}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: postLikes ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`h-4 w-4 mr-2 text-red-500 ${
              postLikes ? "fill-red-500" : ""
            }`}
          />
        </motion.div>
      </motion.div>
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {postLikes ? postLikes : 0}
      </motion.span>
    </Button>
  );
};

export default LikeButton;
