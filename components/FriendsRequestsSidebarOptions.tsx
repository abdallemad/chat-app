"use client";
import { toPusherKey } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function FriendsRequestsSidebarOptions({
  initialUnseenRequestsCount,
  sessionId,
}: {
  initialUnseenRequestsCount: number;
  sessionId: string;
}) {
  const [unseenRequestCount, setUnseenRequestCount] = useState(
    initialUnseenRequestsCount
  );
  // Initialize Pusher
  useEffect(() => {
    // Initialize Pusher client
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to the "user:sessionId:incoming_friend_requests" channel and bind to "incoming_friend_requests" events
    const channel = pusher.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    channel.bind(
      "incoming_friend_requests",
      (incomingFriendRequests: IncomingFriendRequests) => {
        setUnseenRequestCount((prev) => prev + 1);
      }
    );

    return () => {
      pusher.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusher.disconnect();
    };
  }, [ sessionId ]);
  return (
    <Button
      variant={"ghost"}
      size={"lg"}
      className="w-full justify-start px-2"
      asChild
    >
      <Link
        href="/dashboard/requests"
        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
      >
        <div className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 transition-colors items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
          <User className="h-4 w-4" />
        </div>
        <p className="truncate">Friend requests </p>
        {unseenRequestCount > 0 && (
          <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
            {unseenRequestCount}
          </div>
        )}
      </Link>
    </Button>
  );
}
