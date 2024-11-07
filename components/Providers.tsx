"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {Toaster} from 'react-hot-toast'
export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 20 * 60 * 1000,
      },
    },
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster  position="top-center"/>
        <main>{children}</main>
      </QueryClientProvider>
    </>
  );
}
