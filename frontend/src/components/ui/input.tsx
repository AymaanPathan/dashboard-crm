import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 focus:border-neutral-900",
        "hover:border-neutral-300",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-900",
        "invalid:border-red-500 invalid:ring-red-500/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
