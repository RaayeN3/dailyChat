import React from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { LIMIT_MESSAGES } from "@/lib/constant";
import { getFromAndTo } from "@/lib/utils";
import { useMessage } from "@/lib/store/messages";

const SeeMore = () => {
  const { page } = useMessage((state) => state);
  const { setMessages } = useMessage((state) => state);
  const fetshMore = async () => {
    const { from, to } = getFromAndTo(page, LIMIT_MESSAGES);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*,users(*)")
      .order("created_at", { ascending: false })
      .range(from, to);
    console.log(data);
    !error ? setMessages(data.reverse()) : console.log(error);
  };
  return (
    <div
      className=" mx-auto cursor-pointer m-2 text-sm text-gray-300"
      onClick={fetshMore}
    >
      See More
    </div>
  );
};

export default SeeMore;
