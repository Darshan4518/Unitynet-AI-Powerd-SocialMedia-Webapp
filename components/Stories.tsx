<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> e146371 (Initial commit)
>>>>>>> 1c83196 (some issue fixed)
"use client";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { motion } from "framer-motion";

interface StoryItemProps {
  story: {
    _id: string;
    image: string;
    user: {
      name: string;
    };
  };
}

const StoryItem: React.FC<StoryItemProps> = ({ story }) => {
  return (
    <motion.div
      className="flex flex-col items-center py-1"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 opacity-75 blur" />
        <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
          <AvatarImage src={story.image} alt={story.user.name} />
          <AvatarFallback>{story.user.name[0]}</AvatarFallback>
        </Avatar>
      </motion.div>
      <span className="text-xs mt-2 font-medium text-gray-700 truncate w-16 text-center">
        {story.user.name}
      </span>
    </motion.div>
  );
};

export default StoryItem;
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
"use client"
import type React from "react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { X } from "lucide-react"

interface StoryItemProps {
  story: {
    _id: string
    image: string
    user: {
      name: string
    }
  }
}

const StoryItem: React.FC<StoryItemProps> = ({ story }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.div className="flex flex-col items-center py-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          onClick={() => setIsOpen(true)}
        >
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 opacity-75 blur" />
          <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
            <AvatarImage src={story?.image || "/placeholder.svg"} alt={story.user.name} />
            <AvatarFallback>{story?.user.name[0]}</AvatarFallback>
          </Avatar>
        </motion.div>
        <span className="text-xs mt-2 font-medium text-gray-700 truncate w-16 text-center">{story?.user.name}</span>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={story?.image || "/placeholder.svg"} alt={story.user.name} />
                <AvatarFallback>{story?.user.name[0]}</AvatarFallback>
              </Avatar>
              <span>{story.user.name}</span>
            </DialogTitle>
            
          </DialogHeader>
          <div className="overflow-hidden rounded-lg">
            <motion.img
              src={story?.image}
              alt={story.user.name}
              className="w-full h-auto object-cover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default StoryItem
>>>>>>> story-part
>>>>>>> e146371 (Initial commit)
>>>>>>> 1c83196 (some issue fixed)
