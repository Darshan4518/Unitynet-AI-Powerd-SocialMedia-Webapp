import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BadgeCheck, UserRound } from "lucide-react";
import ContentTabs from "@/components/ContentTabs";
import { IPost } from "@/models/Post";
import { IUser } from "@/models/User";
import mongoose from "mongoose";
import FollowButton from "./FollowButton";

interface ProfileData {
  posts: IPost[];
  user: IUser;
  userId: mongoose.Types.ObjectId;
}

export default async function Profile({ posts, user, userId }: ProfileData) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-rose-500 to-purple-600 rounded-full animate-spin-slow opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>
            <Avatar className="w-32 h-32 border-4 border-white relative">
              <AvatarImage
                src={user?.image}
                alt={user?.name}
                className="object-cover"
              />
              <AvatarFallback>IG</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <BadgeCheck className="w-6 h-6 text-blue-500" />
              </div>
              {userId.toString() === user?._id.toString() ? (
                <Link href={`/profile/editprofile`}>
                  <Button
                    variant="outline"
                    className="text-white bg-gray-800 border-white hover:text-black"
                  >
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <div className="flex gap-2">
                  <FollowButton
                    userId={userId as mongoose.Types.ObjectId}
                    targetUserId={user?._id?.toString()}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <div className="font-bold">{posts?.length}</div>
                <div className="text-sm text-gray-400">posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{user?.followers?.length}</div>
                <div className="text-sm text-gray-400">followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{user?.following?.length}</div>
                <div className="text-sm text-gray-400">following</div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold">{user?.userName}</h2>
              <p className="text-sm text-gray-400">
                <UserRound className="w-4 h-4 inline mr-1" />
                UinityNet
              </p>
              <p className="text-sm">{user?.bio}</p>
              <Link href="#" className="text-sm text-blue-400 hover:underline">
                {user?.link}
              </Link>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <ContentTabs posts={posts} />
      </div>
    </div>
  );
}
