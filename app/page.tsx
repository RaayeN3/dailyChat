import ChatContent from "@/components/ChatBox";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import InitUser from "@/lib/store/InitUser";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border md:rounded-xl flex flex-col relative">
          <ChatHeader user={data?.user || undefined} />
          <ChatContent />
          {data.user && <ChatInput />}
        </div>
      </div>

      <InitUser user={data?.user || undefined} />
    </>
  );
}
