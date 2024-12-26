"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { IUser } from "@/models/User";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Chat from "./Chat";

interface MessagesProps {
  users: IUser[];
  userId: string;
}

const Messages: React.FC<MessagesProps> = ({ users, userId }) => {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleUserSelect = useCallback((user: IUser) => {
    setSelectedUser(user);
  }, []);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="container mx-auto p-2 bg-black min-h-screen max-h-screen text-white overflow-hidden flex">
      {/* User List */}
      <div className="lg:w-1/3 border-r border-gray-700 overflow-y-auto p-3">
        <h1 className="text-2xl font-bold mb-4 text-center hidden lg:block">
          Users
        </h1>
        <AnimatePresence>
          {users.map((user: IUser) => (
            <motion.div
              key={user._id.toString()}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              variants={cardVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Card
                className="bg-gray-800 cursor-pointer shadow-lg rounded-lg overflow-hidden hidden lg:block mb-4"
                onClick={() => handleUserSelect(user)}
              >
                <CardContent className="flex items-center p-2 lg:gap-x-3">
                  <Avatar className="h-10 w-10 ring-2 ring-white">
                    <AvatarImage src={user.image} alt={user.userName} />
                    <AvatarFallback>{user.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="font-semibold text-lg text-white">
                    {user.userName}
                  </h2>
                </CardContent>
              </Card>
              <Avatar
                className="h-10 w-10 ring-2 ring-white lg:hidden m-4 cursor-pointer"
                onClick={() => handleUserSelect(user)}
              >
                <AvatarImage src={user.image} alt={user.userName} />
                <AvatarFallback>{user.userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Chat Section */}
      <div className="lg:w-2/3 flex-1 min-h-screen">
        {selectedUser ? (
          <Chat userId={userId} selectedUser={selectedUser} />
        ) : (
          <div className="lg:w-2/3 flex-1 w-full h-full min-h-screen bg-gradient-to-b from-gray-900 to-black flex justify-center items-center">
            <p className="text-white text-lg">
              Select a user to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
