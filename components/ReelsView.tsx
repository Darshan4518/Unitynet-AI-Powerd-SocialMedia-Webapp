"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import LikeButton from "./LikeButton";
import { Post } from "@/types";
import mongoose from "mongoose";

interface ReelProps {
  reel: Post;
  userId: mongoose.Types.ObjectId;
}

export default function ReelsViewer({ reel, userId }: ReelProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoClick = () => {
    const video = videoRef.current;

    if (video) {
      if (!video.paused) {
        video.pause();
        setIsPlaying(false);
      } else {
        video.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      className="relative h-screen w-full max-w-xl overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {reel?.media ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          onClick={handleVideoClick}
          onEnded={handleVideoEnd}
          muted={isMuted}
          playsInline
          loop
        >
          <source src={reel?.media} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
          <p>Video not available</p>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Play/Pause Indicator */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-black/40 rounded-full p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-12 h-12"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
        <LikeButton
          postId={reel?._id}
          userId={userId}
          postLikes={reel?.likes?.length}
          className="rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-all duration-300 group z-50"
        />
      </div>

      {/* Bottom Info */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 text-white"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center mb-2">
          <motion.div
            className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden"
            whileHover={{ scale: 1.1 }}
          >
            {reel?.user?.image ? (
              <Image
                src={reel?.user.image}
                alt="user"
                width={60}
                height={60}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-full h-full p-2" />
            )}
          </motion.div>
          <p className="font-medium">{reel?.user?.userName || "Anonymous"}</p>
        </div>
        <p className="font-medium mb-2 line-clamp-2">
          {reel?.content || "No content available"}
        </p>
      </motion.div>

      {/* Sound Toggle */}
      <motion.div
        className="absolute top-4 right-4"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
