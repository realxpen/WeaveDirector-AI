import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shimmer rounded-[12px] bg-indigo-200/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
