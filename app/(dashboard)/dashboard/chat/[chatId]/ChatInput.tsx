"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "@tanstack/react-query";
import { sendMessageAction } from "../action";
import toast from 'react-hot-toast'

export default function ChatInput({
  chatPartner,
  chatId,
}: {
  chatPartner: User;
  chatId: string;
}) {
  const { mutate: sendMessage, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      if (!input) return;
      await sendMessageAction({ message: input, chatId });
    },
    onSuccess() {
      setInput("");
      textareaRef.current?.focus();
    },
    onError() {
      toast.error('Something went wrong');
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextareaAutosize
          placeholder={`Message: ${chatPartner.name}`}
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="focus:outline-none block resize-none focus:border-transparent px-3 py-2 w-full bg-transparent text-gray-900 placeholder:text-gray-400"
        />
        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden
        >
          <div className="py-px ">
            <div className="h-9" />
          </div>
        </div>
        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button
              disabled={isLoading}
              onClick={() => sendMessage()}
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Post
                </>
              ) : (
                <span>Post</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
