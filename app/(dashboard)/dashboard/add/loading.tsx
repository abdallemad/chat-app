'use client'
import { Skeleton } from "@/components/ui/skeleton"
function loading() {

  return (
    <div className="w-full flex-col gap-3 flex items-center">
      <Skeleton className="mb-4 h-[60px] w-[500px] " />
      <Skeleton className="mb-4 h-[20px] w-[150px] " />
      <Skeleton className="mb-4 h-[50px] w-[400px] " />
    </div>
  )
}

export default loading
