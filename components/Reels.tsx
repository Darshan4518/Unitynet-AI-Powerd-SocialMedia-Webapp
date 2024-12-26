import ReelsViewer from "@/components/ReelsView";
import { getUserFromToken } from "@/hooks/getUserFromToken";
import { getReels } from "@/lib/actions/postActions";
import React from "react";

const Reels = async () => {
  const { data: reels } = await getReels();
  const { id } = await getUserFromToken();
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-800 text-white p-3">
      <div className="flex flex-col gap-2 items-center">
        {reels.map((reel: any) => (
          <ReelsViewer key={reel?._id} reel={reel} userId={id} />
        ))}
      </div>
    </div>
  );
};

export default Reels;
