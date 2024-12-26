"use client";
import { VideoIcon } from "lucide-react";
import React, { useRef } from "react";

const VideoPlayer = ({ source }: { source: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };
  return (
    <div className=" h-full w-full relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        muted
      >
        <source src={source} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className=" absolute top-1 right-1 ">
        <VideoIcon />
      </div>
    </div>
  );
};

export default VideoPlayer;
