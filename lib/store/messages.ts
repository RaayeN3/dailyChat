import Message from "@/components/Message";
import { create } from "zustand";
import { LIMIT_MESSAGES } from "../constant";

export type Imessage = {
  created_at: string;
  edited: boolean;
  id: string;
  send_by: string;
  text: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
  } | null;
};

interface MessageState {
  hasMore: boolean;
  page: number;
  messages: Imessage[];
  addMessage: (message: Imessage) => void;
  actionMessage: Imessage | undefined;
  setActionMessage: (message: Imessage | undefined) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: Imessage | undefined) => void;
  optimisticIds: string[];
  setOptimisticIds: (id: string) => void;
  setMessages: (messages: Imessage[]) => void;
}

export const useMessage = create<MessageState>((set) => ({
  hasMore: true,
  page: 1,
  messages: [],
  optimisticIds: [],
  actionMessage: undefined,
  setMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= LIMIT_MESSAGES,
    })),
  addMessage: (newMessages) =>
    set((state) => ({
      messages: [...state.messages, newMessages],
    })),
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  optimisticDeleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== messageId),
    })),
  optimisticUpdateMessage: (updateMessage) =>
    set((state) => ({
      messages: state.messages.filter((message) => {
        if (message.id === updateMessage?.id) {
          message.text = updateMessage.text;
          message.edited = updateMessage.edited;
        }
        return message;
      }),
    })),
  setOptimisticIds: (id: string) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
}));
