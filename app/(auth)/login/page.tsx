"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LuLoader2 } from "react-icons/lu";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signIn("google");
    } catch (error) {
      toast({
        title: "Some thing wrong try again.",
        description: "please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8 ">
          <div className="flex flex-col items-center gap-8">
            logo
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
