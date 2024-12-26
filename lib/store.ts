import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Message {
  text: string;
  sender: string;
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setMessages: (messages: Message[]) => set(() => ({ messages })),
    }),
    {
      name: "chat-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
