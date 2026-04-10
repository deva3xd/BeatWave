import "./globals.css";
import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "sonner";
import ClientProviders from "@/components/ClientProviders";
import PlayerWrapper from "@/components/PlayerWrapper";

export const metadata: Metadata = {
  title: {
    default: "Beatwave",
    template: "%s - Beatwave"
  },
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
          <SidebarInset className="p-2">
            <ClientProviders>
              {children}
            </ClientProviders>
          </SidebarInset>
          <PlayerWrapper />
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}
