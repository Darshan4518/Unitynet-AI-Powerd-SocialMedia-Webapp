"use client";
import React from "react";
import TimeAgo from "react-timeago";
const CreatedTimeAgo = ({ createdAt }: { createdAt: any }) => {
  return (
    <div className="text-xs text-gray-400">
      <TimeAgo date={createdAt} minPeriod={60} />
    </div>
  );
};

export default CreatedTimeAgo;
