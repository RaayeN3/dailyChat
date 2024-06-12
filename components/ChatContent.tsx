"use client";

import { Imessage, useMessage } from "@/lib/store/messages";
import Message from "./Message";
import { DeleteAlert, EditAlert } from "./MessageActions";
import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowDown } from "lucide-react";
import SeeMore from "./SeeMore";

const ChatContent = () => {
  const [userScroll, setUserScroll] = useState(false);
  const [notification, setNotification] = useState(0);

  const {
    messages,
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
    hasMore,
  } = useMessage((state) => state);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleNewMessage = async (payload: any) => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", payload.new.send_by)
        .single();

      const newMessage: Imessage = {
        id: payload.new.id,
        text: payload.new.text,
        created_at: payload.new.created_at,
        edited: payload.new.edited,
        send_by: payload.new.send_by,
        users: {
          avatar_url: data?.avatar_url as string,
          created_at: data?.created_at as string,
          display_name: data?.display_name as string,
          id: data?.id as string,
        },
      };
      addMessage(newMessage);

      setNotification((current) => current + 1);
    };

    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        handleNewMessage
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          optimisticUpdateMessage(payload.new as Imessage);
          if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScrolled =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      if (isScrolled) {
        setUserScroll(true);
        console.log("user is scrolling");
      } else {
        setUserScroll(false);
        setNotification(0);
      }
    }
  };
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScroll) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const scrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-scroll relative overflow-x-hidden ">
      <DeleteAlert />
      <EditAlert />
      <div className="flex flex-1"></div>
      <div
        className="space-y-7 p-5 overflow-y-auto flex flex-col"
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        {hasMore && <SeeMore />}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      {userScroll && (
        <div className="absolute w-full my-5 bottom-0">
          {notification ? (
            <div
              onClick={scrollDown}
              className="flex justify-center items-center mx-auto cursor-pointer"
            >
              <h1 className="bg-violet-600 rounded-xl p-1 px-3">
                New message ({notification})
              </h1>
            </div>
          ) : (
            <div
              onClick={scrollDown}
              className=" h-10 w-10 bg-blue-600 flex justify-center items-center rounded-full mx-auto border cursor-pointer transition duration-300 hover:scale-110"
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatContent;
