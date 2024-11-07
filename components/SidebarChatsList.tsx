"use client";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ScrollArea } from "./ui/scroll-area";
import { set } from "date-fns";
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
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel1 = pusher.subscribe(toPusherKey(`user:${sessionId}:chats`));
    channel1.bind(
      "new_message",(message:Message & {senderName:string, senderImage:string}) => {
        console.log('triggered',message);
        const shouldNotified = pathname !== `/dashboard/chat/${chatHrefConstructor(message.senderId,sessionId)}`;
        if (!shouldNotified) return;
        toast.custom((t) => (
          <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <a 
            href={`/dashboard/chat/${chatHrefConstructor(message.senderId,sessionId)}`}
            className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="relative h-10 w-10">
                  <Image fill src={message.senderImage} alt="sender name." className="h-10 w-10 rounded-full" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {message.senderName}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {message.text}
                  </p>
                </div>
              </div>
            </a>
            <div className="flex">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ))
        setUnseenMessages((prev) => {
          console.log(prev, message);
          return [...prev, message];
        });
      }
    );
    const channel2 = pusher.subscribe(toPusherKey(`user:${sessionId}:friends`));
    channel2.bind("new_friend", () => {
      router.refresh();
    });

    return () => {
      pusher.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusher.disconnect();
    };
  }, [ pathname, sessionId, router]);

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
