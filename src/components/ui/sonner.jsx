"use client";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "bg-green-600 text-white border-green-700 [&>svg]:text-white",
          error: "bg-red-600 text-white border-red-700 [&>svg]:text-white",
          loading: "border-border",
          default: "bg-background text-foreground border-border"
        },
      }}
      richColors
      closeButton
      position="top-center"
      visibleToasts={3}
      duration={5000}
      {...props}
    />
  );
};

export { Toaster };