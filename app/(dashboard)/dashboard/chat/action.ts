"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { nanoid } from "nanoid";
import { messageValidate } from "@/lib/validators";

export async function sendMessageAction({
  message: text,
  chatId,
}: {
  message: string;
  chatId: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const [id1, id2] = chatId.split("--");
  if (session.user.id !== id1 && session.user.id !== id2) return notFound();
  const friendId = session.user.id === id1 ? id2 : id1;
  const isInFriendList = await db.sismember(
    `user:${session.user.id}:friends`,
    friendId
  );
  if (!isInFriendList) return notFound();
  const user = await db.get(`user:${session.user.id}`);
  // all valid and send the message.
  const timestamp = Date.now()
  const messageData:Message = {
    id:nanoid(),
    receiverId:friendId,
    senderId:session.user.id,
    text,
    timestamp
  };
  const message = messageValidate.parse(messageData);
  await db.zadd(`chat:${chatId}:messages`, {
    score: timestamp,
    member: JSON.stringify(message),
  });
  console.log(user);
}
