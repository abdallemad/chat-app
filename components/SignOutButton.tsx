"use client";
import React, { ButtonHTMLAttributes } from "react";
import { Button } from "./ui/button";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2, LogOutIcon } from "lucide-react";
import toast from "react-hot-toast";


interface SingOutButtonAttribute
  extends ButtonHTMLAttributes<HTMLButtonElement> {
    name?:string | undefined
  }

export default function SignOutButton({
  className,
  ...props
}: SingOutButtonAttribute) {
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
          toast.error("Error!")
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
