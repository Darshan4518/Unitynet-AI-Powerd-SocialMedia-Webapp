"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { addComment } from "@/lib/actions/postActions";
import mongoose from "mongoose";
import { toast } from "sonner";
import { Comment } from "@/types";

interface CommentSectionProps {
  postId: mongoose.Types.ObjectId;
  comments: Comment[];
  userImage?: string;
}

export default function CommentSection({
  comments,
  postId,
  userImage,
}: CommentSectionProps) {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const handleComment = async () => {
    try {
      const { success } = await addComment(postId, comment);
      if (success) {
        toast.success(" Comment added successfully");
        setComment("");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="mt-4 w-full flex-1">
      <p
        className=" text-xs font-semibold text-gray-600 text-start w-full cursor-pointer"
        onClick={() => setShowComments(!showComments)}
      >
        {showComments ? "Hide" : "Show"} Comments...
      </p>
      {showComments && (
        <div className=" mt-2">
          {comments?.length ? (
            comments?.map((comment, ind: number) => (
              <div className=" space-y-2" key={ind}>
                <div className="flex items-center space-x-2 mt-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={comment?.user?.image} />
                    <AvatarFallback>DS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-gray-100 rounded-2xl p-2">
                    <p className="text-xs ">
                      <span className="font-semibold text-xs px-2">
                        {comment?.user?.name}
                      </span>
                      {comment?.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className=" text-xs my-4 text-gray-600 text-center">
              No comments yet
            </p>
          )}
        </div>
      )}
      <div className="mt-4 flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userImage} />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <Input
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 bg-gray-100 border-none rounded-full text-sm"
        />
        <Button
          size="sm"
          className="rounded-full bg-blue-500 hover:bg-blue-600"
          onClick={handleComment}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Post comment</span>
        </Button>
      </div>
    </div>
  );
}
