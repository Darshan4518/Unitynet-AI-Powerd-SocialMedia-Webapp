"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ScrollArea } from "./ui/scroll-area";
import {
  BotIcon,
  Home,
  MessageCircle,
  Sparkles,
  User,
  Video,
  LogOut,
} from "lucide-react";
import SearchUsersSheet from "./SearchUsersSheet";
import CreatePost from "./CreatePost";
import { getUserFromToken } from "@/hooks/getUserFromToken";
import { signOut } from "@/lib/actions/userActions";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Navigation {
  icon: React.ReactNode;
  text: string;
  path: string;
  hidden?: boolean;
}

const NavigationSideBar = () => {
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { id } = await getUserFromToken();
        setUserId(id.toString());
      } catch (error: any) {
        toast.error(error?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, []);

  const navigations: Navigation[] = [
    { icon: <Home className="w-6 h-6" />, text: "Home", path: "/" },
    {
      icon: <Sparkles className="w-6 h-6" />,
      text: "Explore",
      path: "/explore",
    },
    { icon: <Video className="w-6 h-6" />, text: "Reels", path: "/reels" },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      text: "Messages",
      path: "/chat",
    },
    {
      icon: <BotIcon className="w-6 h-6" />,
      text: "AskGenie",
      path: "/askgenie",
    },
  ];

  const handleLogout = async () => {
    const { message } = await signOut();
    toast(message);
  };

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.aside
      className="fixed bottom-0 left-0 right-0 lg:relative lg:block w-full bg-gradient-to-b from-zinc-900 to-black border-r border-zinc-800 shadow-lg lg:shadow-none z-50 lg:w-64 lg:h-screen"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <ScrollArea className="h-full ">
        <div className="sm:px-4 px-2 py-6">
          <motion.div
            className="mb-6 hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              Unitynet
            </h1>
          </motion.div>

          <nav className="flex lg:flex-col flex-row sm:gap-2">
            <TooltipProvider>
              <AnimatePresence>
                {navigations.map(({ path, text, icon, hidden }, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={"ghost"}
                          className={`w-full justify-start text-zinc-200 ${
                            pathname === path
                              ? "bg-slate-600 text-white"
                              : "bg-transparent"
                          } ${hidden ? "hidden lg:flex" : "flex"}
                          transition-colors duration-200 ease-in-out hover:bg-slate-700`}
                          onClick={() => router.push(path)}
                        >
                          <motion.div
                            className="flex gap-2 lg:mx-0 mx-auto items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>{icon}</span>
                            <span
                              className={`hidden lg:block ${
                                text === "AskGenie" ? "text-red-500" : ""
                              }`}
                            >
                              {text}
                            </span>
                          </motion.div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="lg:hidden">
                        <p>{text}</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: navigations.length * 0.1 }}
              >
                <SearchUsersSheet />
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: (navigations.length + 1) * 0.1 }}
              >
                <CreatePost />
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: (navigations.length + 2) * 0.1 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-2 text-zinc-200 ${
                        pathname === `/profile/${userId}`
                          ? "bg-slate-600 text-white"
                          : "bg-transparent"
                      } transition-colors duration-200 ease-in-out hover:bg-slate-700`}
                      onClick={() => router.push(`/profile/${userId}`)}
                      disabled={loading || !userId}
                    >
                      <motion.div
                        className="flex gap-2 lg:mx-0 mx-auto items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <User className="w-6 h-6" />
                        <span className="hidden lg:block">Profile</span>
                      </motion.div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="lg:hidden">
                    <p>Profile</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: (navigations.length + 3) * 0.1 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full hidden md:block justify-start gap-2 text-zinc-200 mt-auto transition-colors duration-200 ease-in-out hover:bg-slate-700"
                      onClick={handleLogout}
                    >
                      <motion.div
                        className="flex gap-2 lg:mx-0 mx-auto items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogOut className="w-6 h-6" />
                        <span className="hidden lg:block">Logout</span>
                      </motion.div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="lg:hidden">
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </TooltipProvider>
          </nav>
        </div>
      </ScrollArea>
    </motion.aside>
  );
};

export default NavigationSideBar;
