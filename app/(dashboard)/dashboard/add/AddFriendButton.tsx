"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addFriendSchema, AddFriendType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { addFriendAction } from "./action";
import toast from "react-hot-toast";

export default function AddFriendButton() {
  const form = useForm<AddFriendType>({
    resolver: zodResolver(addFriendSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutate: addFriend, isPending } = useMutation({
    mutationKey: ["add-friend"],
    mutationFn: async ({ email }: AddFriendType) =>
      await addFriendAction({ email }),
    onError: () => {
      toast.error("There is something wrong try again later.");
    },
    onSuccess: (data) => {
      if (data && "okay" in data && data.okay === false) {
        return toast.error(data.message);
      } else return toast.success("Friend added successfully.");
      form.reset();
    },
  });
  const handelSubmit = ({ email }: AddFriendType) => {
    addFriend({ email });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handelSubmit)}
        className="max-w-xl py-2"
      >
        <FormField
          control={form.control}
          name={"email"}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">email</FormLabel>
              <FormControl>
                <Input {...field} className="w-[500px] mb-8" />
              </FormControl>
              <FormMessage />
              <Button type="submit" disabled={isPending} size={'lg'} className="w-[500px] mt-8 block">
                Add
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
