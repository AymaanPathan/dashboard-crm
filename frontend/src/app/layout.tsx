"use client"
import { Provider } from "react-redux";
import "./globals.css";
import { store } from "@/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
