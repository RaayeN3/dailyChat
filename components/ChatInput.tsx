"use client";

import React, { useRef } from "react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { Input } from "./ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";

const ChatInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { setOptimisticIds } = useMessage((state) => state);
  const user = useUser((state) => state?.user);

  const handleSendMessage = async (text: string) => {
    if (text.trim()) {
      const newMessage = {
        id: uuidv4(),
        text,
        send_by: user?.id,
        edited: false,
        created_at: new Date().toISOString(),
        users: {
          avatar_url: user?.user_metadata.avatar_url,
          id: user?.id,
          display_name: user?.user_metadata.user_name,
        },
      };
      setOptimisticIds(newMessage.id);
      const { error } = await supabase.from("messages").insert({ text });
      if (error) {
        toast.error(error.message, {
          action: {
            label: "Hide",
            onClick: () => console.log("Hide th error"),
          },
        });
      }
    } else {
      toast.error("Message empty", {
        action: {
          label: "Hide",
          onClick: () => console.log("Hide the message"),
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      handleSendMessage(inputRef.current.value);
      inputRef.current.value = ""; // Clear the input after sending
    }
  };

  return (
    <div className="p-5">
      <form className="flex gap-1" onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          placeholder="Send message"
          className="outline-none w-full h-[40px] rounded-xl px-4 bg-transparent border border-gray-500"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
        />
        <Button
          type="submit"
          variant={"ghost"}
          className="flex gap-2 text-violet-500"
        >
          <Send className="h-fit w-fit" />
          <span className="max-md:hidden">Send</span>
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
