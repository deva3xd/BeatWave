import { Toaster } from "sonner";
import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beatwave - Dashboard",
  description: "Beatwave ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main>{children}</main>
      <Toaster />
    </>
  )
}
