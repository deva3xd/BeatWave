"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ListMusic } from "lucide-react";
import AddSong from "./modals/AddSong";
import Link from "next/link";

export function NavMain() {
  return (
    <SidebarGroup className="pb-0">
      <SidebarGroupLabel className="text-white font-semibold text-md border-b border-white rounded-none text-xl flex flex-row justify-center uppercase">
        BeatWave
      </SidebarGroupLabel>
      <SidebarGroupLabel className="text-xs font-light text-gray-200">
        Menu
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild title="Song List">
            <Link href="/" className="flex items-center gap-2 w-full">
              <ListMusic size={20} />
              <span className="text-sm">Song List</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <AddSong />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}