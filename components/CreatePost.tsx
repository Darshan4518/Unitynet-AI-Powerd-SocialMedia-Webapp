"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { generateCaption } from "@/lib/actions/aiActions";
import { createPostOrReel } from "@/lib/actions/postActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Loader2, PlusCircle, Upload, X, ImageIcon, Video } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePost() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPeding, setIsPending] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [caption, setCaption] = useState("");
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      setMediaType(file.type.startsWith("image/") ? "image" : "video");
      setStep(2);
    }
  };

  const handleGenerateCaption = async () => {
    setIsGeneratingCaption(true);
    try {
      if (!caption.trim()) {
        toast.error("Please enter a caption");
        return;
      }
      const content = await generateCaption(caption);
      setCaption(content as string);
    } catch (err: any) {
      toast.error(err?.message);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!mediaFile) {
      toast.error("Please upload an image or video before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("media", mediaFile);
    formData.append("content", caption);

    try {
      setIsPending(true);
      await createPostOrReel(formData);
      setIsOpen(false);
      setStep(1);
      setMediaFile(null);
      setMediaPreview(null);
      setMediaType(null);
      setCaption("");
      toast.success("Post created successfully!");
    } catch (err) {
      toast.error("Failed to create the post. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle />
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-zinc-200"
          >
            <div className="flex gap-2 lg:mx-0 mx-auto items-center">
              <PlusCircle className="w-6 h-6" />
              <span className="hidden lg:block">Create</span>
            </div>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-[400px] sm:h-[300px]"
              >
                <label htmlFor="media-upload" className="cursor-pointer">
                  <motion.div
                    className="flex flex-col items-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Upload className="w-12 h-12 mb-2 text-gray-400" />
                    <span className="text-sm text-gray-500 mb-2">
                      Upload an image or video
                    </span>
                    <div className="flex gap-2">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                      <Video className="w-6 h-6 text-gray-400" />
                    </div>
                  </motion.div>
                  <input
                    id="media-upload"
                    type="file"
                    name="media"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                </label>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <div className="w-full sm:w-1/2 relative h-[50vh] sm:h-[60vh]">
                  {mediaPreview && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative w-full h-full"
                    >
                      {mediaType === "image" ? (
                        <Image
                          src={mediaPreview}
                          alt="Uploaded preview"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      ) : (
                        <video
                          src={mediaPreview}
                          className="w-full h-full object-cover rounded-lg"
                          controls
                        />
                      )}
                      <motion.button
                        type="button"
                        className="absolute top-4 right-4 bg-black bg-opacity-60 p-2 rounded-full text-white shadow-md hover:bg-opacity-80"
                        onClick={() => {
                          setMediaFile(null);
                          setMediaPreview(null);
                          setMediaType(null);
                          setStep(1);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    </motion.div>
                  )}
                </div>
                <div className="w-full sm:w-1/2 flex flex-col">
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    className="flex-grow mb-4"
                  />
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleGenerateCaption}
                        disabled={isGeneratingCaption}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        {isGeneratingCaption ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "Generate AI Caption"
                        )}
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="submit"
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition hover:scale-105"
                        disabled={isPeding}
                      >
                        {isPeding ? "Posting..." : "Post"}
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        variant="outline"
                        className="w-full sm:w-auto text-gray-600 border-gray-300"
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
