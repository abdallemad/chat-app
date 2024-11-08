"use client";

import { chatHrefConstructor } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import toast, { Toast } from "react-hot-toast";

function ToastMessage({
  t,
  message,
  sessionId,
}: {
  t: Toast;
  message: Message & { senderName: string; senderImage: string };
  sessionId: string;
}) {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <a
        href={`/dashboard/chat/${chatHrefConstructor(message.senderId, sessionId)}`}
        className="flex-1 w-0 p-4"
      >
        <div className="flex items-start">
          <div className="relative h-10 w-10">
            <Image
              fill
              src={message.senderImage}
              alt="sender name."
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {message.senderName}
            </p>
            <p className="mt-1 text-sm text-gray-500">{message.text}</p>
          </div>
        </div>
      </a>
      <div className="flex">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ToastMessage;
