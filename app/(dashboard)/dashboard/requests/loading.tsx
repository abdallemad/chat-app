'use client'
'use client'
import { Skeleton } from "@/components/ui/skeleton"
function loading() {

  return (
    <div className="w-full flex-col gap-3 flex">
      <Skeleton className="mb-4 h-[60px] w-[500px] " />
      <Skeleton className="mb-4 h-[50px] w-[350px] " />
      <Skeleton className="mb-4 h-[50px] w-[350px] " />
      <Skeleton className="mb-4 h-[50px] w-[350px] " />
    </div>
  )
}

export default loading

