import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Plus } from "lucide-react";
import Link from "next/link";
import Photo1 from "@/images/1.jpg";
import Photo2 from "@/images/2.jpg";
import Photo3 from "@/images/3.jpg";

export function AppSidebar() {
  return (
    <Sidebar className="border-none">
      <SidebarContent className="bg-foreground text-white px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white mx-2 font-semibold text-md border-b border-white rounded-none text-2xl flex flex-row justify-center uppercase">
            BeatWave
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-6">
              <SidebarMenuItem className="my-2">
                <span className="text-sm font-semibold text-gray-200">
                  Playlists
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem className="ms-4 mb-1">
                <div className="flex flex-row gap-2">
                  <Image src={Photo1} alt="thumbnail" className="h-12 w-12 rounded-xs" priority />
                  <div className="flex flex-col justify-center">
                    <span className="font-semibold text-base">Mood</span>
                    <span className="font-normal text-xs text-gray-200">Created in 2025</span>
                  </div>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem className="ms-4 mb-1">
                <div className="flex flex-row gap-2">
                  <Image src={Photo2} alt="thumbnail" className="h-12 w-12 rounded-xs" priority />
                  <div className="flex flex-col justify-center">
                    <span className="font-semibold text-base">Chill</span>
                    <span className="font-normal text-xs text-gray-200">Created in 2025</span>
                  </div>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem className="ms-4 mb-1">
                <div className="flex flex-row gap-2">
                  <Image src={Photo3} alt="thumbnail" className="h-12 w-12 rounded-xs" priority />
                  <div className="flex flex-col justify-center">
                    <span className="font-semibold text-base text-green-500">Mix</span>
                    <span className="font-normal text-xs text-gray-200">Created in 2025</span>
                  </div>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem className="my-2">
                <span className="text-sm font-semibold text-gray-200">
                  Menu
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem className="ms-4 mb-1">
                <Link
                  href="/song"
                  className="hover:opacity-85 flex flex-row items-center gap-2"
                >
                  <Plus size={20} />
                  Add Song
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem className="ms-4 mb-1">
                <Link
                  href="/song"
                  className="hover:opacity-85 flex flex-row items-center gap-2"
                >
                  <Plus size={20} />
                  Create Playlist
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
