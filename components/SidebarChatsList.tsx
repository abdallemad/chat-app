"use client";
import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
export default function SidebarChatsList({
  friends,
  sessionId,
}: {
  friends: User[];
  sessionId: string;
}) {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((m) => {
          return !pathname.includes(m.senderId);
        });
      });
    }
  }, [pathname]);
  return (
    <ul role="list">
      <ScrollArea className="max-h-[25rem] -mx-2 space-y-1">
        {friends.sort().map((friend) => {
          const unseenMessagesCount = unseenMessages.filter((unm) => {
            return unm.senderId === friend.id;
          }).length;
          return (
            <li key={friend.id}>
              <a
                href={`/dashboard/chat/${chatHrefConstructor(
                  friend.id,
                  sessionId
                )}`}
                className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              >
                <div className="relative w-8 h-8">
                  <Image
                    fill
                    src={friend.image}
                    alt="friend image"
                    className="object-cover w-8 h-8 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span>{friend.name} </span>
                {unseenMessagesCount !== 0 && (
                  <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
                    {unseenMessagesCount}
                  </div>
                )}
              </a>
            </li>
          );
        })}
      </ScrollArea>
    </ul>
  );
}
