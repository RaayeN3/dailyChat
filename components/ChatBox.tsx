import React, { Suspense } from "react";
import ChatContent from "./ChatContent";
import { createClient } from "@/utils/supabase/server";
import InitMessages from "@/lib/store/InitMessages";
import { LIMIT_MESSAGES } from "@/lib/constant";

const ChatBox = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*,users(*)")
    .order("created_at", { ascending: false })
    .limit(LIMIT_MESSAGES);

  return (
    <Suspense fallback={"Loading..."}>
      <ChatContent />
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  );
};

export default ChatBox;
