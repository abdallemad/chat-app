"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FriendsRequestsSidebarOptions from "./FriendsRequestsSidebarOptions";
import { Icon, Icons } from "./Icons";
import SidebarChatsList from "./SidebarChatsList";
import SignOutButton from "./SignOutButton";
import { Button, buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";

export interface SidebarOption {
  id: number;
  name: string;
  href: string;
  icon: Icon;
}
function MobleSidebar({
  friends,
  session,
  sidebarOptions,
  unseenRequestCount,
}: {
  friends:User[],
  session: Session,
  sidebarOptions: SidebarOption[],
  unseenRequestCount: number
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  useEffect(()=>{
    setIsOpen(false)
  },[ pathname])
  return (
    <div className="md:hidden block z-[999]">
      <nav className="absolute top-0 left-0 right-0 bg-zinc-50 flex items-center justify-between px-4">
        <Link href={"/dashboard"} className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-8 text-indigo-600" />
        </Link>
        <Button className="gap-2" onClick={() => setIsOpen(true)}>
          Menu <Menu className="h-4 w-4" />
        </Button>
      </nav>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              className="fixed top-0 bottom-0 left- w-[30rem] z-[99999]"
              initial={{ x: -480 }}
              animate={{ x: 0 }}
              exit={{ x: -480 }}
            >
              <div className="flex h-full w-full grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 z-[10000]">
                <Link
                  href={"/dashboard"}
                  className="flex h-16 shrink-0 items-center"
                >
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
                      <SidebarChatsList
                        friends={friends}
                        sessionId={session.user.id}
                      />
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
                        <SignOutButton className="h-full aspect-square ml-auto" />
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/50"
            />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className={buttonVariants({
                variant: "outline",
                size: "icon",
                className: "absolute top-4 right-4",
              })}
            >
              <X className="h-4 w-4" />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobleSidebar;
