"use client";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast'
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LuLoader2 } from "react-icons/lu";
import { Icons } from "@/components/Icons";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signIn("google");
    } catch (error) {
      toast.error('There is something wrong try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8 ">
          <div className="flex flex-col items-center gap-8">
            <Icons.Logo className="h-8 w-8 text-indigo-600" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your Account
            </h2>
          </div>
          <Button
            disabled={isLoading}
            className="max-w-sm mx-auto w-full"
            onClick={() => loginWithGoogle()}
          >
            {isLoading ? (
              <>
                <LuLoader2 className="animate-spin w-4 h-4 shrink-0" />
                Google
              </>
            ) : (
              <>
                <FcGoogle className="mr-2" />
                Google
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
