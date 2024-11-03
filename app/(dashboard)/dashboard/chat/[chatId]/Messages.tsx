"use client";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/validators";
import { useRef, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
export default function Messages({
  initialMessages,
  sessionId,
  sessionImage,
  chatPartner,
}: {
  initialMessages: Message[];
  sessionId: string;
  sessionImage: string;
  chatPartner: User;
}) {
  const scrollDownRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const formateTimeStamp = (date: number) => {
    return format(date, "HH:mm");
  };
  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages.map((m, i) => {
        const isCurrent = m.senderId === sessionId;
        const hasNextImageFromSame =
          messages[i - 1]?.senderId === messages[i].senderId;
        return (
          <div
            className="chat-message"
            key={`${m.id}--${m.timestamp.toString()}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrent,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrent,
                    "order-2 items-start": !isCurrent,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrent,
                    "bg-gray-200 text-gray-900": !isCurrent,
                    "rounded-br-none": !hasNextImageFromSame && isCurrent,
                    "rounded-bl-none": !hasNextImageFromSame && !isCurrent,
                  })}
                >
                  {m.text + " "}
                  <span className="ml-2 text-xs text-gray-400">
                    {formateTimeStamp(m.timestamp)}
                  </span>
                </span>
              </div>
              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrent,
                  "order-1": !isCurrent,
                  invisible: hasNextImageFromSame,
                })}
              >
                <Image
                  fill
                  src={isCurrent ? sessionImage : chatPartner.image}
                  alt="user image"
                  className="rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
