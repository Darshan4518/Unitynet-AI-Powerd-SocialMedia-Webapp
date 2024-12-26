import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Heart, MessageCircle, UserRound, Video } from "lucide-react";
import Image from "next/image";
import { IPost } from "@/models/Post";
import VideoPlayer from "./VideoPlayer";

const ContentTabs = ({ posts }: { posts: IPost[] }) => {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full justify-center">
        <TabsTrigger value="posts" className="flex gap-2">
          <Grid className="w-4 h-4" />
          POSTS
        </TabsTrigger>
        <TabsTrigger value="reels" className="flex gap-2">
          <Video className="w-4 h-4" />
          REELS
        </TabsTrigger>
        <TabsTrigger value="tagged" className="flex gap-2">
          <UserRound className="w-4 h-4" />
          TAGGED
        </TabsTrigger>
      </TabsList>

      {/* Posts Tab */}
      <TabsContent value="posts" className="mt-8">
        <div className=" flex flex-wrap gap-3">
          {posts
            .filter((post) => !post?.isReel)
            .map((post) => (
              <div
                key={post?._id.toString()}
                className="aspect-square relative group cursor-pointer  p-1 w-full md:max-w-md md:w-[20vw] max-h-[50vh]"
              >
                <Image
                  src={post?.media as string}
                  alt={post?._id.toString()}
                  width={500}
                  height={500}
                  className="object-contain h-full w-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                  <div className="flex items-center gap-1">
                    <Heart className="w-6 h-6" />
                    <span className="font-semibold">
                      {post?.likes.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-semibold">
                      {post?.comments.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="reels" className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {posts
            .filter((post) => post?.isReel)
            .map((post) => (
              <div
                key={post?._id.toString()}
                className="relative group cursor-pointer border border-gray-300/70 rounded overflow-hidden max-w-md max-h-[50vh]"
              >
                <VideoPlayer source={post?.media as string} />
              </div>
            ))}
        </div>
      </TabsContent>

      {/* Tagged Tab */}
      <TabsContent value="tagged">
        <div className="text-center text-gray-500 py-8">No tagged posts</div>
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
