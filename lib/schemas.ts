import { z, infer } from "zod";

export const addFriendSchema = z.object({
  email: z
    .string({ message: "Please provide email." })
    .email({ message: "Please provide correct email." }),
});
export type AddFriendType = z.infer<typeof addFriendSchema>;
