"use client";

import ReduxProvider from "@/stores/redux-provider";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReduxProvider>{children}</ReduxProvider>;
}