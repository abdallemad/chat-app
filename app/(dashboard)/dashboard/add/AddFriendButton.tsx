"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addFriendSchema, AddFriendType } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { addFriendAction } from "./action";

export default function AddFriendButton() {
  const { toast } = useToast();
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
      toast({
        title: "Error",
        description: "There is something wrong try again later.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      if (data && "okay" in data && data.okay === false) {
        return toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      } else
        return toast({
          title: "Success",
          description: "You have send a friend request!",
          className: "bg-green-600 text-white",
        });
      // form.reset();
    },
  });
  const handelSubmit = ({ email }: AddFriendType) => {
    addFriend({ email });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handelSubmit)} className="max-w-sm p-4">
        <FormField
          control={form.control}
          name={"email"}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="capitalize">email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <Button type="submit" disabled={isPending}>
                Add
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
