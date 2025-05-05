"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import FormButton from "./FormButton";
import { createStory } from "@/lib/actions/postActions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Upload, X } from "lucide-react";
import Image from "next/image";

export default function AddStory() {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleAddStory = async (formData: FormData) => {
    try {
      const { success } = await createStory(formData);
      if (success) {
        toast.success("Story created successfully");
        setIsOpen(false);
        setPreviewUrl(null);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          className="flex flex-col items-center py-1 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="relative"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 to-green-500 opacity-75 blur" />
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              <Plus className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>
          <span className="text-xs mt-2 font-medium text-gray-700">
            Add Story
          </span>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-center">Add a Story</DialogTitle>
        <form
          className="space-y-4"
          action={(formData: FormData) => handleAddStory(formData)}
        >
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="story-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <AnimatePresence>
                {previewUrl ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={previewUrl}
                      alt="Story preview"
                      className="w-full h-full object-cover rounded-lg"
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
                      width={100}
                      height={100}
>>>>>>> story-part
>>>>>>> e146371 (Initial commit)
>>>>>>> 1c83196 (some issue fixed)
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                      onClick={(e) => {
                        e.preventDefault();
                        setPreviewUrl(null);
                      }}
                    >
                      <X size={16} />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center pt-5 pb-6"
                  >
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </label>
            <Input
              id="story-upload"
              type="file"
              name="story"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              >
                Cancel
              </motion.button>
            </DialogClose>
            <FormButton tittle="Add Story" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
