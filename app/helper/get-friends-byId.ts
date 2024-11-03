import { db } from "@/lib/db";

export async function getFriendsByUserId(sessionId: string) {
  const friendsIds = await db.smembers(`user:${sessionId}:friends`);
  const friends = await Promise.all(
    friendsIds.map(async (fi) => {
      return (await db.get(`user:${fi}`)) as User;
    }),
  );
  return friends;
}
