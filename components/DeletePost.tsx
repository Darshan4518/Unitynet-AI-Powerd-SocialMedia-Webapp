"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { deleteUserPost } from "@/lib/actions/postActions";
import { toast } from "sonner";
import mongoose from "mongoose";

const DeletePost = ({ postId }: { postId: mongoose.Types.ObjectId }) => {
  const handleDelete = async () => {
    const { message, success } = await deleteUserPost(postId);
    if (success) {
      toast.success(message);
    }
  };
  return (
    <Popover>
      <PopoverTrigger>
        <MoreVertical className=" size-4 text-white" />
      </PopoverTrigger>
      <PopoverContent className=" flex flex-col gap-2">
        <Button variant={"destructive"} onClick={handleDelete}>
          Delete Post
        </Button>
        <Button variant={"secondary"}>Cnacel</Button>
      </PopoverContent>
    </Popover>
  );
};

export default DeletePost;
