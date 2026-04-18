"use client";

import { Toaster } from "sonner";

export default function ToastListener() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: "'DM Sans', sans-serif",
        },
      }}
    />
  );
}
