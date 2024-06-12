"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Imessage, useMessage } from "@/lib/store/messages";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useRef } from "react";

const supabase = createClient();

export const DeleteAlert = () => {
  const actionMessage = useMessage((state) => state.actionMessage);
  const optimisticDeleteMessage = useMessage(
    (state) => state.optimisticDeleteMessage
  );

  const handleDeleteMessage = async () => {
    if (!actionMessage?.id) return;
    
    optimisticDeleteMessage(actionMessage.id);
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", actionMessage.id);
    if (error) {
      toast.error(error.message,{position:"top-center"});
    } else {
      toast.success("Message deleted",{position:"top-center"});
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const EditAlert = () => {
  const actionMessage = useMessage((state) => state.actionMessage);
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const optimisticUpdateMessage = useMessage(
    (state) => state.optimisticUpdateMessage
  );

  const handleEdit = async () => {
    if (!actionMessage?.id) return;

    const text = inputRef.current.value.trim();
    if (text) {
      optimisticUpdateMessage({
        ...actionMessage,
        text,
        edited: true,
      } as Imessage);
      const { error } = await supabase
        .from("messages")
        .update({ text, edited: true })
        .eq("id", actionMessage.id);
      if (error) {
        toast.error(error.message,{position:"top-center"});
      } else {
        toast.success("Message edited successfully",{position:"top-center"});
      }
      document.getElementById("trigger-edit")?.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="trigger-edit"></button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>
            You can edit your message right here
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Input
              id="name"
              defaultValue={actionMessage?.text}
              className="col-span-3"
              ref={inputRef}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleEdit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
