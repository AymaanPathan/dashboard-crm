"use client";
import { Provider } from "react-redux";
import "./globals.css";
import { store } from "@/store";
  import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Provider store={store}>{children}</Provider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              padding: "1rem",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            },
          }}
        />
      </body>
    </html>
  );
}
