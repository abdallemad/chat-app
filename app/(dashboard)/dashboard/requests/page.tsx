import FriendRequests from "@/app/(dashboard)/dashboard/requests/FriendRequests";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return notFound();
  const friendRequestsIds = await db.smembers(
    `user:${session.user.id}:incoming_friend_requests`,
  );

  const incomingFriends = await Promise.all(
    friendRequestsIds.map(async (senderId) => {
      const sender = (await db.get(`user:${senderId}`)) as User;
      return {
        senderId: sender.id,
        senderEmail: sender.email,
      };
    }),
  );
  // console.log(incomingFriends);
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8 ">Friends Request</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriends={incomingFriends}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
}
