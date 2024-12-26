import dynamic from "next/dynamic";
import React from "react";

const Reels = dynamic(() => import("@/components/Reels"), {
  loading: () => <div>Loading...</div>,
});

const ReelsPage = async () => {
  return <Reels />;
};

export default ReelsPage;
