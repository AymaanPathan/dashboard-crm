"use client";
import { Provider } from "react-redux";
import "../../app/globals.css";

import { store } from "@/store";
import { Toaster } from "sonner";
import Navbar from "./dashboard/CrmNavbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Navbar />
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
