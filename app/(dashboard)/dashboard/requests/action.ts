"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function acceptFriendAction({ senderId }: { senderId: string }) {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");
  // check if they are already friends.
  const isAlreadyFriends = await db.sismember(
    `user:${session.user.id}:friends`,
    senderId,
  );
  if (isAlreadyFriends) throw new Error("AlreadyFriends");
  const hasFriendRequest = await db.sismember(
    `user:${session.user.id}:incoming_friend_requests`,
    senderId,
  );
  if (!hasFriendRequest) throw new Error("He has not send you a request.");
  
  await db.sadd(`user:${session.user.id}:friends`, senderId);
  await db.sadd(`user:${senderId}:friends`, session.user.id);
  await db.srem(`user:${session.user.id}:incoming_friend_requests`, senderId);
  await db.srem(`user:${senderId}:incoming_friend_requests`, session.user.id);
  return { message: "the sender is add to friend list" };
}


export async function denyFriendAction({ senderId }: { senderId: string }) {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");
  await db.srem(`user:${session.user.id}:incoming_friend_requests`, senderId);
}
