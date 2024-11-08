import { getFriendsByUserId } from "@/app/helper/get-friends-byId";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  const friends = await getFriendsByUserId(session.user.id);

  const friendsWithMessages = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessage] = (await db.zrange(
        `chat:${chatHrefConstructor(friend.id, session.user.id)}:messages`,
        -1,
        -1
      )) as Message[];
      console.log(lastMessage);
      return {
        ...friend,
        lastMessage,
      };
    })
  );
  return (
    <div className="container py-12">
      <h1 className="font-bold text-5xl mb-8">Resents Chats</h1>
      {friendsWithMessages.length ? (
        friendsWithMessages.map((friend) => (
          <div
            key={friend.id}
            className="relative bg-zinc-50 border border-zinc-200 p-3 rounded-md"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400" />
            </div>
            <Link
              href={`/dashboard/chat/${chatHrefConstructor(session.user.id, friend.id)}`}
              className="relative flex gap-3"
            >
              <div className="mb-4 flex shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-12 w-12 ">
                  <Image
                    fill
                    src={friend.image}
                    alt={`${friend.name} profile picture`}
                    className="w-full h-full rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md ">
                  <span className="text-zinc-400">
                    {friend.lastMessage.senderId === session.user.id
                      ? "You: "
                      : ""}
                  </span>
                  <span>{friend.lastMessage.text}</span>
                </p>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <p className=" text-zinc-500 text-sm">No recent chats</p>
      )}
    </div>
  );
}
