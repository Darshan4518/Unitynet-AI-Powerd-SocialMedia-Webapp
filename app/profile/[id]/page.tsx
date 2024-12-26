import { getProfile } from "@/lib/actions/userActions";
import { getUserFromToken } from "@/hooks/getUserFromToken";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import mongoose from "mongoose";

const Profile = dynamic(() => import("@/components/Profile"), {
  loading: () => <Loader2 className=" animate-spin m-30" />,
});

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await getUserFromToken();
  const { id } = await params;
  const { user, posts } = await getProfile(new mongoose.Types.ObjectId(id));

  return (
    <Profile
      posts={posts}
      user={user}
      userId={userId.id as mongoose.Types.ObjectId}
    />
  );
}
