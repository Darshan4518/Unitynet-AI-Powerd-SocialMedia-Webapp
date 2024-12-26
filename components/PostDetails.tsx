import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  BookmarkIcon,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
} from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import VideoPlayer from "./VideoPlayer";

import CreatedTimeAgo from "./TimeAgo";
import { Comment } from "@/types";
export default function PostDetails({ post }: { post: any }) {
  return (
    <Dialog>
      <DialogTitle />
      <DialogTrigger asChild>
        <div
          key={post?._id.toString()}
          className="aspect-square relative group cursor-pointer p-1 w-[30vw] md:w-[20vw] h-auto"
        >
          {post?.isReel ? (
            <VideoPlayer source={post?.media as string} />
          ) : (
            <Image
              src={post?.media as string}
              alt={post?._id.toString()}
              width={500}
              height={600}
              className="object-contain h-full w-full"
            />
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white pointer-events-none">
            <div className="flex items-center gap-1">
              <Heart className="w-6 h-6" />
              <span className="font-semibold">{post?.likes.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-6 h-6" />
              <span className="font-semibold">
                {post?.comments.length || 0}
              </span>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[60%] p-0 bg-black/30 backdrop-blur-xl border-gray-800">
        <div className="grid lg:grid-cols-[1fr,400px] md:mx-h-[80vh] ">
          {/* Media Section */}
          <div className="relative h-full w-full">
            {post?.isReel ? (
              <video
                className="  object-cover  mx-auto md:w-auto w-full md:h-full h-[20vh]"
                controls
              >
                <source src={post?.media as string} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={post?.media as string}
                alt={post?._id.toString()}
                width={500}
                height={500}
                className="object-contain h-full w-full"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent " />
          </div>

          {/* Content Section */}
          <div className="flex flex-col h-full bg-gray-900/50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <Avatar className="ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900">
                  <AvatarImage src={post?.user?.image} />
                  <AvatarFallback className="bg-purple-500 text-white">
                    RD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-100">
                    {post?.user?.userName}
                  </div>
                  <CreatedTimeAgo createdAt={post?.createdAt} />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-300"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {post?.comments?.length ? (
                post?.comments?.map((comment: Comment, ind: number) => (
                  <div className=" space-y-2" key={ind}>
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment?.user?.image} />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-gray-100 rounded-2xl p-2">
                        <p className="text-xs">
                          <span className="font-semibold">
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

            {/* Actions Section */}
            <div className="border-t border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-purple-400 hover:bg-purple-500/20 transition-all duration-300"
                  >
                    <Heart className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-purple-400 hover:bg-purple-500/20 transition-all duration-300"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-purple-400 hover:bg-purple-500/20 transition-all duration-300"
                  >
                    <Send className="h-6 w-6" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-purple-400 hover:bg-purple-500/20 transition-all duration-300"
                >
                  <BookmarkIcon className="h-6 w-6" />
                </Button>
              </div>
              <div className="font-semibold text-gray-100 mb-4">
                {post?.likes?.length} likes
              </div>
              <div className="flex items-center space-x-2 w-full bg-gray-900/50 rounded-full px-4 py-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-purple-400"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Add a comment..."
                  className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-300 placeholder:text-gray-500"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
