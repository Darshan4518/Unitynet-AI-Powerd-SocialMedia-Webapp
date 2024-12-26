"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import FormButton from "@/components/FormButton";
import { updateProfile } from "@/lib/actions/userActions";
import { IUser } from "@/models/User";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Sparkle } from "lucide-react";
import { generateBio } from "@/lib/actions/aiActions";

const ProfileEditForm = ({ user }: { user: IUser }) => {
  const [bio, setBio] = useState<string>(user?.bio || "");

  const handleSubmit = async (formData: FormData) => {
    try {
      const { message, success } = await updateProfile(formData);
      if (success) {
        toast.success(message);
      }
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while updating your profile."
      );
    }
  };

  const enhanceBio = async () => {
    try {
      if (!bio.trim()) {
        toast.error("Please enter a bio");
        return;
      }
      const output = await generateBio(bio);
      setBio(output);
    } catch (error: any) {
      toast.error(error?.message || "Failed to enhance bio.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center">Edit Profile</h1>

        <form className="space-y-6" action={handleSubmit}>
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-rose-500 to-purple-600 rounded-full animate-spin-slow opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>
              <Avatar className="w-32 h-32 border-4 border-white relative">
                <AvatarImage
                  src={user?.image}
                  alt="User Avatar"
                  className="object-cover"
                />
                <AvatarFallback>IG</AvatarFallback>
              </Avatar>
            </div>
            <Input
              id="image"
              name="image"
              type="file"
              className="mt-4 w-64 text-white bg-gray-800"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-400">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={user?.name}
              placeholder="Enter your name"
              className="bg-gray-800 text-white placeholder-gray-400"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-gray-400">
              Username
            </Label>
            <Input
              id="userName"
              name="username"
              defaultValue={user?.userName}
              placeholder="Enter your username"
              className="bg-gray-800 text-white placeholder-gray-400"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-400">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email}
              placeholder="Enter your email"
              className="bg-gray-800 text-white placeholder-gray-400"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-400">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={bio}
              placeholder="Tell us about yourself"
              onChange={(e) => setBio(e.target.value)}
              className="bg-gray-800 text-white placeholder-gray-400"
            />
            <Button
              variant="ghost"
              type="button"
              className="flex items-center space-x-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
              onClick={enhanceBio}
            >
              <Sparkle className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-medium text-slate-200">
                Enhance Using AI
              </span>
            </Button>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="text-gray-400">Gender</Label>
            <Select defaultValue={user?.gender} name="gender">
              <SelectTrigger>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label htmlFor="link" className="text-gray-400">
              Link
            </Label>
            <Input
              id="link"
              name="link"
              defaultValue={user?.link}
              placeholder="Enter your website or social link"
              className="bg-gray-800 text-white placeholder-gray-400"
            />
          </div>

          {/* Submit Button */}
          <FormButton tittle="Save Changes" />
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;
