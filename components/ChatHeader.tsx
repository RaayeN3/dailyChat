"use client";
import React from "react";
import { Button } from "./ui/button";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const ChatHeader = ({ user }: { user: User | undefined }) => {
  const router = useRouter();

  const handleLoginWithProvider = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback", // Redirect URL after login
      },
    });
  };

  // Function to handle logout
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh(); 
  };

  return (
    <div className="h-20">
      <div className="py-5 px-7 border-b flex justify-between items-center h-full">
        <div>
          <h1 className="text-xl font-bold">Daily Chat</h1>
        </div>
        {!user ? (
          // Show login button if user is not logged in
          <Button onClick={handleLoginWithProvider} variant={"ghost"}>
            Login <LogIn className="h-4" />
          </Button>
        ) : (
          // Show logout button if user is logged in
          <Button onClick={handleLogout} variant={"destructive"}>
            Logout <LogOut className="h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
