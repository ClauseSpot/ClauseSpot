"use client";

import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right">
      <div
        className="fixed bottom-4 right-4 flex flex-col gap-2 pointer-events-none"
        style={{ zIndex: 99999 }} // ✅ Mantém acima de tudo
      >
        {toasts.map(function ({ id, title, description, variant, ...props }) {
          const isError = variant === "destructive";

          return (
            <Toast
              key={id}
              {...props}
              className={`pointer-events-auto shadow-lg backdrop-blur-md border rounded-md p-3 ${
                isError
                  ? "bg-[#fff0f0]/95 border-red-400"
                  : "bg-white/95 border-[#C69F66]"
              }`}
              style={{
                zIndex: 99999, // ✅ Garante prioridade sobre modais
                color: isError ? "#1A365D" : "#1A365D",
              }}
            >
              <div className="grid gap-1">
                {title && (
                  <ToastTitle className="font-semibold text-[#1A365D]">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-sm text-[#2B6CB0]">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </Toast>
          );
        })}
        <ToastViewport
          className="fixed bottom-0 right-0 flex flex-col p-4 gap-2 w-[380px] max-w-[100vw]"
          style={{ zIndex: 99999 }}
        />
      </div>
    </ToastProvider>
  );
}
