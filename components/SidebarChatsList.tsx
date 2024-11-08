"use client";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ScrollArea } from "./ui/scroll-area";
import ToastMessage from "./ToastMessage";
export default function SidebarChatsList({
  friends,
  sessionId,
}: {
  friends: User[];
  sessionId: string;
}) {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const handleNewMessage = useCallback((message:Message & {senderName:string, senderImage:string}) => {
    console.log('triggered',message);
    const shouldNotified = pathname !== `/dashboard/chat/${chatHrefConstructor(message.senderId,sessionId)}`;
    if (!shouldNotified) return;
    toast.custom((t) => (
      <ToastMessage t={t} message={message} sessionId={sessionId} />
    ))
    setUnseenMessages((prev) => {
      console.log(prev, message);
      return [...prev, message];
    });
  } ,[pathname, sessionId]);
  
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel1 = pusher.subscribe(toPusherKey(`user:${sessionId}:chats`));
    channel1.bind(
      "new_message",
      handleNewMessage
    );
    const channel2 = pusher.subscribe(toPusherKey(`user:${sessionId}:friends`));
    channel2.bind("new_friend", () => {
      router.refresh();
    });

    return () => {
      pusher.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusher.disconnect();
    };
  }, [ pathname, sessionId, router, handleNewMessage ]);

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
