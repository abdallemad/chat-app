"use client";
import React, { ButtonHTMLAttributes } from "react";
import { Button } from "./ui/button";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOutIcon } from "lucide-react";

interface SingOutButtonAttribute
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function SignOutButton({
  className,
  ...props
}: SingOutButtonAttribute) {
  const { toast } = useToast();
  const [isSingingOut, setIsSingingOut] = useState(false);
  return (
    <Button
      {...props}
      variant={"ghost"}
      onClick={async () => {
        setIsSingingOut(true);
        try {
          await signOut();
        } catch (error) {
          toast({
            description: "some thing went wrong",
            title: "Error",
            variant: "destructive",
          });
        } finally {
          setIsSingingOut(false);
        }
      }}
    >
      {isSingingOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOutIcon className="w-4 h-4" />
      )}
    </Button>
  );
}
