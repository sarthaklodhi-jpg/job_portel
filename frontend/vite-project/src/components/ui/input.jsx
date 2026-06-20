import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-slate-500 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-white/10 h-11 w-full min-w-0 rounded-xl border bg-slate-950/50 px-4 py-2 text-base text-slate-100 shadow-sm transition-[border-color,color,box-shadow,background] outline-none file:mr-3 file:inline-flex file:h-8 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:text-sm file:font-semibold file:text-slate-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-sky-400 focus-visible:ring-sky-500/15 focus-visible:ring-[4px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props} />
  );
}

export { Input }
