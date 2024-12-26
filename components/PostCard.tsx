import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, Share2 } from "lucide-react";
import CommentSection from "./CommentSection";
import Link from "next/link";
import DeletePost from "./DeletePost";
import { getUserFromToken } from "@/hooks/getUserFromToken";
import { Post } from "@/types";
import mongoose from "mongoose";
import FollowButton from "./FollowButton";
import LikeButton from "./LikeButton";
import CreatedTimeAgo from "./TimeAgo";

export default async function PostCard({ post }: { post: any }) {
  const { id } = await getUserFromToken();
  return (
    <Card className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105">
      <CardHeader className=" flex flex-row justify-between items-center space-x-4 p-2 px-2 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex flex-row items-center gap-x-6">
          <Link href={`/profile/${post?.user?._id}`}>
            <Avatar className="h-8 w-8 ring-2 ring-white">
              <AvatarImage src={post?.user?.image} />
              <AvatarFallback>DV</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-white">
              {post?.user?.name}
            </span>
            <span className="text-xs text-blue-200 ">{post?.user?.email}</span>
          </div>
          {post?.user?._id.toString() !== id?.toString() && (
            <FollowButton
              userId={id}
              targetUserId={post?.user?._id?.toString()}
              className=" bg-transparent text-white hover:bg-transparent"
            />
          )}
        </div>
        {post?.user?._id === id ? (
          <DeletePost postId={post?._id as mongoose.Types.ObjectId} />
        ) : null}
      </CardHeader>
      <CardContent className="p-0 relative">
        {post?.isReel ? (
          <div className="relative h-56 w-full overflow-hidden rounded-3xl">
            <video controls className=" w-full h-full object-contain">
              <source src={post?.media} type="video/mp4" />
            </video>
          </div>
        ) : (
          <Image
            src={post?.media as string}
            alt="Post image"
            width={600}
            height={500}
            className="w-full max-h-[40vh] aspect-square object-contain"
          />
        )}

        {post?.media && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-75 rounded-full p-2">
            <Share2 className="h-5 w-5 text-gray-700" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col p-3 w-full">
        <div
          className={` w-full flex ${
            post?.media ? "flex-col" : "flex-col-reverse"
          } gap-2 `}
        >
          <div className="flex justify-between w-full mb-4">
            <div className="flex space-x-2 w-full">
              <LikeButton
                postId={post?._id}
                userId={id}
                postLikes={post?.likes?.length}
              />
              <Button variant="outline" size="sm" className="rounded-full">
                <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                {post?.comments.length ? post?.comments.length : 0}
              </Button>
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <Bookmark className="h-5 w-5 text-purple-500" />
              <span className="sr-only">Save</span>
            </Button>
          </div>
          <div className="space-y-2">
            <p className=" font-medium text-xs">
              <span className="font-semibold text-blue-600 px-1 ">
                {post?.user?.name}
              </span>
              {post?.content}
            </p>
          </div>
        </div>
        <CommentSection postId={post?._id} comments={post?.comments} />
        <div className="text-xs text-gray-400 mt-4 flex items-center gap-2">
          Posted <CreatedTimeAgo createdAt={post?.createdAt} />
        </div>
      </CardFooter>
    </Card>
  );
}
