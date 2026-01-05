import "../globals.css";
import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "sonner";
import ClientProviders from "@/components/ClientProviders";

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
          <SidebarInset>
            <ClientProviders>
              {children}
            </ClientProviders>
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}
