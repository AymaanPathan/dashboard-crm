import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950 shadow-sm border border-neutral-900/10",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm border border-red-600/10",
        outline:
          "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100 shadow-sm hover:shadow-md",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 border border-neutral-200/50",
        ghost:
          "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 hover:text-neutral-900",
        link: "text-neutral-900 underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
