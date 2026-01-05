"use client";

import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";
import useSWR from "swr";
import { Playlist } from "@prisma/client";
import { NavMain } from "./Nav-Main";
import { NavPlaylists } from "./Nav-Playlists";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function AppSidebar() {
  const { data } = useSWR<{ playlists: Playlist[] }>('/api/playlists', fetcher);
  const playlists = data?.playlists ?? [];

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarContent className="bg-foreground text-white">
        <NavMain />
        <NavPlaylists playlists={playlists} />
      </SidebarContent>
    </Sidebar >
  )
}
