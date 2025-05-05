"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { IUser } from "@/models/User";
import { ChatChannel, ChatMessage } from "@/lib/ably";
import { useChatStore } from "@/lib/store";
import { toast } from "sonner";

interface ChatProps {
  selectedUser: IUser;
  userId: string;
}

const Chat: React.FC<ChatProps> = ({ selectedUser, userId }) => {
  const [message, setMessage] = useState("");
  const { messages, addMessage, setMessages } = useChatStore();
  const [chatChannel, setChatChannel] = useState<ChatChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  const handleNewMessage = useCallback(
    (msg: ChatMessage) => {
      if (msg.sender !== userId) {
        addMessage(msg);
      }
    },
    [userId, addMessage]
  );

  useEffect(() => {
    let channel: ChatChannel | null = null;

    const initializeChat = async () => {
      if (!selectedUser) return;

      channel = new ChatChannel(userId, selectedUser._id.toString());
      setChatChannel(channel);

      try {
        await channel.connect();
        const history = await channel.getHistory();
        setMessages(history);
        await channel.subscribe(handleNewMessage);
      } catch (error: any) {
        toast.error(error?.message);
      }
    };

    initializeChat();
  }, [selectedUser, handleNewMessage, setMessages]);

  const sendMessage = async () => {
    if (!message.trim() || !chatChannel || isSending) {
      return;
    }

    setIsSending(true);

    const newMessage: ChatMessage = {
      text: message,
      sender: userId,
      timestamp: new Date().toISOString(),
    };

    try {
      await chatChannel.publish(newMessage);
      addMessage(newMessage);
      setMessage("");
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (

    <div className="w-full h-full flex-1 bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
    <div className="w-full h-full flex-1 bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
    <div className="w-full h-full flex-1 bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
    <div className="w-full h-full flex-1 bg-gradient-to-b from-gray-900 to-black text-white  flex-col hidden">
      <div className="flex-1 overflow-y-auto p-3 lg:max-h-[85vh] max-h-[75vh]">
        <div className="mb-6 flex items-center">
          <Avatar className="h-8 w-8 ring-2 ring-white m-4">
            <AvatarImage src={selectedUser.image} alt={selectedUser.userName} />
            <AvatarFallback>{selectedUser.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-lg font-semibold">{selectedUser.userName}</span>
        </div>
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div
              className={`flex ${
                message.sender === userId ? "justify-end" : "justify-start"
              }`}
              key={index}
            >
              <div
                className={`max-w-[80%] p-2 px-3 rounded-xl shadow-lg ${
                  message.sender === userId
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <p className="break-words">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="sticky bottom-0 bg-black/90 backdrop-blur-sm p-4 border-t border-gray-700">
        <div className="relative max-w-4xl mx-auto flex items-center gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow text-gray-300 bg-gray-800 border-gray-700 py-3 px-4 rounded-full shadow-md focus:ring focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <Button
            onClick={sendMessage}
            variant="secondary"
            size="sm"
            disabled={isSending}
            className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-500 focus:ring focus:ring-blue-300 disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
