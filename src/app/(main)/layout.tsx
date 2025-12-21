import "../globals.css";
import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Beatwave",
  description: "Beatwave ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-screen mx-auto bg-background">
            {children}
          </main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}
