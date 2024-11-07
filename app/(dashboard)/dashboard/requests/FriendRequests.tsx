"use client";
import { Check, UserPlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { acceptFriendAction, denyFriendAction } from "./action";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import Pusher from "pusher-js";
import { toPusherKey } from "@/lib/utils";

export default function FriendRequests({
  incomingFriends,
  sessionId,
}: {
  incomingFriends: IncomingFriendRequests[];
  sessionId: string;
}) {
  const [incomingFriendRequests, setIncomingFriendRequest] =
    useState<IncomingFriendRequests[]>(incomingFriends);
  const router = useRouter();

  // Initialize Pusher
  useEffect(() => {
    // Initialize Pusher client
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to the "user:sessionId:incoming_friend_requests" channel and bind to "incoming_friend_requests" events
    const channel = pusher.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
    channel.bind("incoming_friend_requests",(incomingFriendRequests: IncomingFriendRequests)=>{
      setIncomingFriendRequest((prev) => [...prev,incomingFriendRequests]);
    } );

    return () => {
      pusher.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
      pusher.disconnect();
    };
  }, [ sessionId ]);
  const { mutate: acceptFriend } = useMutation({
    mutationFn: async ({
      sessionId,
      senderId,
    }: {
      sessionId: string;
      senderId: string;
    }) => {
      await acceptFriendAction({ senderId });
      return senderId;
    },
    onSuccess: (senderId) => {
      setIncomingFriendRequest((prev) =>
        prev.filter((req) => req.senderId !== senderId)
      );
      toast.success('Friend added successfully.');
      router.refresh();
    },
    onError(err) {
      if (err instanceof Error)
        toast.error(err.message);
      else
        toast.error('There is something happened try again later!');
    },
  });
  const { mutate: denyFriend } = useMutation({
    mutationFn: async ({
      sessionId,
      senderId,
    }: {
      sessionId: string;
      senderId: string;
    }) => {
      await denyFriendAction({ senderId });
      return senderId;
    },
    onSuccess: (senderId) => {
      setIncomingFriendRequest((prev) =>
        prev.filter((req) => req.senderId !== senderId)
      );
      toast.success('Denied Successfully!');
      router.refresh();
    },
    onError(err) {
      if (err instanceof Error)
        toast.error(err.message);
      else
        toast.error('There is something happened try again later!');
    },
  });
  return (
    <>
      {incomingFriendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to Show...</p>
      ) : (
        incomingFriendRequests.map((request) => {
          return (
            <div key={request.senderId} className="flex gap-4 items-center">
              <UserPlus className="text-black" />
              <p className="font-medium text-lg">{request.senderEmail}</p>
              <button
                onClick={() => {
                  acceptFriend({
                    sessionId: sessionId,
                    senderId: request.senderId,
                  });
                }}
                aria-label="accept friend"
                className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
              >
                <Check className="font-semibold text-white w-3/4 h-3/4" />
              </button>
              <button
                onClick={() => {
                  denyFriend({
                    sessionId: sessionId,
                    senderId: request.senderId,
                  });
                }}
                aria-label="deny friend"
                className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
              >
                <X className="font-semibold text-white w-3/4 h-3/4" />
              </button>
            </div>
          );
        })
      )}
    </>
  );
}

