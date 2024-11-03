"use client";
import { Check, UserPlus, X } from "lucide-react";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { acceptFriendAction, denyFriendAction } from "./action";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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
        prev.filter((req) => req.senderId !== senderId),
      );
      toast({
        title: "Accepted!",
        description: "You have Accept this friend",
        className: "bg-green-600 text-white",
      });
      router.refresh();
    },
    onError(err) {
      if (err instanceof Error)
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      else
        toast({
          title: "Error",
          description: "There is something happened try again later!",
          variant: "destructive",
        });
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
        prev.filter((req) => req.senderId !== senderId),
      );
      toast({
        title: "Denied!",
        description: "You have deny this friend",
        className: "bg-green-600 text-white",
      });
      router.refresh();
    },
    onError(err) {
      if (err instanceof Error)
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      else
        toast({
          title: "Error",
          description: "There is something happened try again later!",
          variant: "destructive",
        });
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
