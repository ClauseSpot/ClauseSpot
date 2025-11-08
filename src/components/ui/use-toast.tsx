"use client";

import * as React from "react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

export type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number; // ✅ Adicionamos esta linha
};

let listeners: Array<(toasts: ToasterToast[]) => void> = [];
let toasts: ToasterToast[] = [];

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

export function toast(props: Omit<ToasterToast, "id">) {
  const id = Math.random().toString(36).substring(2);
  const newToast = { ...props, id };
  toasts = [newToast];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3000);
  return id;
}

export function useToast() {
  const [state, setState] = React.useState<ToasterToast[]>(toasts);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((l) => l !== setState);
    };
  }, []);

  return {
    toasts: state,
    toast,
  };
}
