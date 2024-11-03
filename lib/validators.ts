import { z } from "zod";

export const messageValidate = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const arrayMessagesValidate = z.array(messageValidate);

export type Message = z.infer<typeof messageValidate>;
