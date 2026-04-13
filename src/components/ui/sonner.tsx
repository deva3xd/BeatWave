"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-white/12 bg-neutral-950/92 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl",
          title: "text-sm font-semibold text-white",
          description: "text-sm text-white/65",
          actionButton:
            "rounded-full bg-green-400 px-3 py-2 text-sm font-semibold text-black hover:bg-green-300",
          cancelButton:
            "rounded-full border border-white/12 bg-white/6 px-3 py-2 text-sm font-medium text-white hover:bg-white/10",
          success: "border-emerald-400/25",
          error: "border-red-400/25",
          warning: "border-amber-400/25",
          info: "border-sky-400/25",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "rgba(10, 10, 10, 0.92)",
          "--normal-text": "white",
          "--normal-border": "rgba(255, 255, 255, 0.12)",
          "--border-radius": "1rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
