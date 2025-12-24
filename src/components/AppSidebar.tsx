"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ListMusic } from "lucide-react";
import CreatePlaylist from "./modals/CreatePlaylist";
import AddSong from "./modals/AddSong";
import Link from "next/link";
import PlaylistLibrary from "./PlaylistLibrary";

export function AppSidebar() {
  return (
    <Sidebar className="border-none">
      <SidebarContent className="bg-foreground text-white px-1">
        <SidebarGroup className="p-1">
          <SidebarGroupLabel className="text-white font-semibold text-md border-b border-white rounded-none text-2xl flex flex-row justify-center uppercase">
            BeatWave
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="my-2">
              <span className="text-sm font-light text-gray-200">
                Menu
              </span>
              <SidebarMenuItem className="ms-4 mb-1">
                <Link href="/" className="flex items-center gap-2 hover:opacity-75 w-1/2">
                  <ListMusic size={20} />
                  <div className="text-sm">Song List</div>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem className="ms-4 mb-1">
                <AddSong />
              </SidebarMenuItem>
              <SidebarMenuItem className="ms-4 mb-1">
                <CreatePlaylist />
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu className="my-2">
              <PlaylistLibrary />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar >
  )
}
