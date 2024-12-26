import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { getUserFromToken } from "@/hooks/getUserFromToken";
import { getProfile, getUsers } from "@/lib/actions/userActions";
import { IUser } from "@/models/User";
import FollowButton from "./FollowButton";
const SuggestedUserBar = async () => {
  const { id } = await getUserFromToken();
  const { user }: { user: IUser } = await getProfile(id);
  const { users } = await getUsers();
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex items-center space-x-4 px-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.image} />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-200">{user?.name}</p>
          <p className="text-xs text-zinc-400">{user?.userName}</p>
        </div>
      </div>
      <Separator className="bg-zinc-800" />
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-sm font-medium text-zinc-400">
            Suggested for you
          </h2>
          <Link href="#" className="text-xs font-medium text-zinc-200">
            See All
          </Link>
        </div>
        {users.map((user: IUser) => (
          <div
            className="flex items-center space-x-4 px-2"
            key={user?._id.toString()}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.image} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-200">
                {user?.userName}
              </p>
            </div>
            <FollowButton
              userId={id}
              targetUserId={user?._id?.toString()}
              className=" bg-transparent text-blue-400 hover:bg-transparent hover:text-blue-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUserBar;
