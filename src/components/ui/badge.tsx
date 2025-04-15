
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: 
          "border-transparent bg-emerald-500 text-white hover:bg-emerald-600",
        animated:
          "border-transparent bg-primary text-primary-foreground animate-pulse-light hover:bg-primary/80",
      },
      animation: {
        none: "",
        pulse: "animate-pulse-light",
        glow: "animate-badge-glow",
        bounce: "animate-subtle-bounce",
      }
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, animation, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant, animation }), className)}
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
