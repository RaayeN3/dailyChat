import { Imessage, useMessage } from "@/lib/store/messages";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useUser } from "@/lib/store/user";

const Message = ({ message }: { message: Imessage }) => {
  const user = useUser((state) => state.user);

  return (
    <div className="flex gap-2 group ">
      <div>
        <Image
          src={message.users?.avatar_url || "/default_avatar.webp"}
          alt={message.users?.display_name || "Default Avatar"}
          width={40}
          height={40}
          className=" rounded-full ring-1"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-between">
          <div className="flex gap-1">
            <h1 className="font-bold">{message.users?.display_name}</h1>
            <h1 className="text-sm text-gray-400">
              {new Date(message.created_at).toDateString()}
            </h1>
            {message.edited && (
              <h1 className="text-sm text-gray-400">edited</h1>
            )}
          </div>
          {message.users?.id === user?.id && <MessageMenu message={message} />}
        </div>
        <p className="text-gray-300">{message.text}</p>
      </div>
    </div>
  );
};
export default Message;

const MessageMenu = ({ message }: { message: Imessage }) => {
  const setActionMessage = useMessage((state) => state.setActionMessage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-edit")?.click();
            setActionMessage(message);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById("trigger-delete")?.click();
            setActionMessage(message);
          }}
        >
          <div className=" text-red-500 font-semibold">Delete</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
