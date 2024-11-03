"use server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function addFriendAction({ email }: { email: string }) {
  const toAddFriend = ((await db.get(`user:email:${email}`)) as string) || null;
  const session = await getServerSession(authOptions);
  // check for authorization.
  if (!session?.user) return redirect("/login");
  //check for the user if its exists
  if (!toAddFriend) return { message: "there is no user Found", okay: false };
  // check if the user try to add him self.
  if (session.user.id === toAddFriend)
    return { message: `You can't add your self!`, okay: false };
  // check if the user try to add the existing add.
  const isAlreadyAdded = await db.sismember(
    `user:${toAddFriend}:incoming_friend_requests`,
    session.user.id,
  );
  if (isAlreadyAdded)
    return { message: "You are actually add him.", okay: false };
  // check of if they are friends
  const isFriend = await db.sismember(
    `user:${toAddFriend}:friends`,
    session.user.id,
  );
  if (isFriend) return { message: "You are actually a friends.", okay: false };
  db.sadd(`user:${toAddFriend}:incoming_friend_requests`, session.user.id);
}
