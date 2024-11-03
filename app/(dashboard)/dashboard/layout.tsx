import { getFriendsByUserId } from "@/app/helper/get-friends-byId";
import FriendsRequestsSidebarOptions from "@/components/FriendsRequestsSidebarOptions";
import { Icon, Icons } from "@/components/Icons";
import SidebarChatsList from "@/components/SidebarChatsList";
import SignOutButton from "@/components/SignOutButton";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  icon: Icon;
}

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOptions: SidebarOption[] = [
    {
      id: 1,
      name: "Add Friend",
      href: "/dashboard/add",
      icon: "UserPlus",
    },
  ];
  const session = await getServerSession(authOptions);
  if (!session?.user) return notFound();

  const friends = await getFriendsByUserId(session?.user.id);
  // console.log(friends);
  const unseenRequestCount = (
    await db.smembers(`user:${session.user.id}:incoming_friend_requests`)
  ).length;
  return (
    <div className="w-full flex h-screen">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href={"/dashboard"} className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-8 text-indigo-600" />
        </Link>
        {friends.length > 0 && (
          <p className="text-xs font-semibold leading-6 text-gray-400">
            Your Chats
          </p>
        )}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatsList friends={friends} sessionId={session.user.id} />
            </li>

            <li>
              <p className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </p>
              {/* side bar options. */}
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((op, i) => {
                  const Icon = Icons[op.icon];
                  return (
                    <li key={op.id}>
                      <Button
                        variant={"ghost"}
                        size={"lg"}
                        className="w-full justify-start px-2"
                        asChild
                      >
                        <Link
                          href={op.href}
                          className="text-gray-700 transition-colors hover:text-indigo-600 group gap-3 rounded-md leading-6 font-semibold"
                        >
                          <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white transition-colors">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="truncate">{op.name}</span>
                        </Link>
                      </Button>
                    </li>
                  );
                })}
                <li>
                  <FriendsRequestsSidebarOptions
                    sessionId={session.user.id!}
                    initialUnseenRequestsCount={unseenRequestCount}
                  />
                </li>
              </ul>
            </li>

            <li className="-mx-6 mt-auto flex items-center ">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ""}
                    alt="your image"
                  />
                </div>
                <span className="sr-only">You image</span>
                <div className="flex flex-col">
                  <span aria-hidden>{session.user.name || "user"}</span>
                  <span className="text-xs text-zinc-400" aria-hidden>
                    {session.user.email}
                  </span>
                </div>
                <SignOutButton className="h-full aspect-square" />
              </div>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
}
