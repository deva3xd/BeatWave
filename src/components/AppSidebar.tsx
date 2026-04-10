"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useSWR from "swr";
import { Playlist } from "@prisma/client";
import { ListMusic, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Ph from "@/images/placeholder.png";
import AddPlaylistSong from "./modals/AddPlaylistSong";
import CreatePlaylist from "./modals/CreatePlaylist";
import DeletePlaylist from "./modals/DeletePlaylist";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { data } = useSWR<{ playlists: Playlist[] }>('/api/playlists', fetcher);
  const playlists = data?.playlists ?? [];

  return (
    <Sidebar collapsible="icon" className="border-none pl-2 py-2">
      <SidebarContent className="bg-foreground text-white rounded-md">
        {/* main */}
        <SidebarGroup className="pb-0">
          <SidebarGroupLabel className="text-white font-semibold text-md rounded-none text-xl uppercase">
            BeatWave
          </SidebarGroupLabel>
          <SidebarGroupLabel className="text-xs font-light text-white opacity-75">
            Menu
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild title="Song List" className={`${isActive("/") && "bg-white text-black"} rounded-md`}>
                <Link href="/" className="flex items-center gap-2 w-full">
                  <ListMusic />
                  <span className="text-sm">Song List</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild title="Song List" className={`${isActive("/add-song") && "bg-white text-black"} rounded-md`}>
                <Link href="/add-song" className="flex items-center gap-2 w-full">
                  <Plus />
                  <span className="text-sm">Add Song</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {/* main end */}

        {/* playlist */}
        <SidebarGroup className="pt-0">
          <SidebarGroupLabel className="text-xs font-light text-white opacity-75 flex justify-between group-data-[collapsible=icon]:hidden">
            Playlists <CreatePlaylist />
          </SidebarGroupLabel>
          <SidebarMenu>
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <SidebarMenuItem key={playlist.id}>
                  <div className="flex justify-between items-center gap-2 bg-gray-500/5 hover:bg-gray-500/10">
                    <Image src={Ph} alt="thumbnail" className="w-12 shrink-0 rounded-xs" title={playlist.name} priority />
                    <Link href={`/${playlist.id}`} className="flex flex-col truncate">
                      <span className="text-base truncate hover:underline">{playlist.name}</span>
                      <span className="text-xs font-light truncate">
                        Created in {new Date(playlist.createdAt).getFullYear()}
                      </span>
                    </Link>
                    <div className="flex items-center">
                      <AddPlaylistSong playlist={playlist} />
                      <DeletePlaylist playlist={playlist} />
                    </div>
                  </div>
                </SidebarMenuItem>
              ))
            ) : (
              <span className="text-sm ms-2">No Playlist Available</span>
            )}
          </SidebarMenu>
        </SidebarGroup >
        {/* playlist end */}
      </SidebarContent>
    </Sidebar >
  )
}
