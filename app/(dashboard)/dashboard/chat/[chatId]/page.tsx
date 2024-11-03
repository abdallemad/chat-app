import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { arrayMessagesValidate } from "@/lib/validators";
import Image from "next/image";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
async function getChatMessages(chatId: string) {
  try {
    const dbMessages: Message[] = await db.zrange(
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const reverseMessages = dbMessages.reverse();
    // this for validation.
    const messages = arrayMessagesValidate.parse(reverseMessages);
    return messages;
  } catch (error) {
    notFound();
  }
}

export default async function page({ params }: { params: { chatId: string } }) {
  const { chatId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return notFound();
  if (!chatId) return notFound();
  const [userId1, userId2] = chatId.split("--");
  if (session.user.id !== userId1 && session.user.id !== userId2)
    return notFound();
  const chatPartnerId = session.user.id === userId1 ? userId2 : userId1;
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;
  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)] ">
      <div className="flex sm:items-center justify-between py-3 px-2 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4 ">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture.`}
                fill
                className="rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <p className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {chatPartner.name}
              </span>
            </p>
            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <Messages
        chatPartner={chatPartner}
        sessionImage={session.user.image || ""}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
}
