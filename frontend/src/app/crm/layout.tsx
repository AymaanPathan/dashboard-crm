"use client";

import { Provider, useDispatch } from "react-redux";
import "../../app/globals.css";
import { useEffect } from "react";
import { RootDispatch, store } from "@/store";
import { Toaster } from "sonner";
import Navbar from "./deals/CrmSideBar";
import { getTodayLeadTasksSlice } from "@/store/slices/leadTaskSlice";
import GlobalReminderProvider from "@/components/providers/GlobalReminderProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch: RootDispatch = useDispatch();

  useEffect(() => {
    dispatch(getTodayLeadTasksSlice());
  }, [dispatch]);

  return (
    <>
      <Provider store={store}>
        <Navbar />
        <GlobalReminderProvider />
        <main className="md:ml-60 min-h-screen bg-white transition-all">
          {children}
        </main>
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
      </Provider>
    </>
  );
}
