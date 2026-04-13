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
import useSWRImmutable from "swr/immutable";
import { Playlist } from "@prisma/client";
import { ListMusic, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { getPlaylists } from "@/lib/getPlaylists";
import Image from "next/image";
import Link from "next/link";
import Ph from "@/images/placeholder.png";
import AddPlaylistSong from "./modals/AddPlaylistSong";
import CreatePlaylist from "./modals/CreatePlaylist";
import DeletePlaylist from "./modals/DeletePlaylist";

const menus = [
  {
    name: "Song List",
    link: "/",
    icon: <ListMusic />
  },
  {
    name: "Add Song",
    link: "/add-song",
    icon: <Plus />
  }
]

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const isPlaylistActive = (playlistId: number) => pathname === `/${playlistId}`;
  const { data } = useSWRImmutable<{ playlists: Playlist[] }>("/api/playlists", getPlaylists);
  const playlists = data?.playlists ?? [];

  return (
    <Sidebar collapsible="icon" variant="floating" className="border-none pl-2 py-2">
      <SidebarContent className="rounded-[1.5rem] bg-transparent px-2 py-3 text-white">
        {/* main */}
        <SidebarGroup className="pb-2">
          <SidebarGroupLabel className="h-auto px-2 text-white/95 font-semibold text-xl tracking-[0.28em] rounded-none uppercase group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:justify-center">
            <span className="group-data-[collapsible=icon]:hidden">BeatWave</span>
            <span className="hidden size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-sm tracking-[0.2em] group-data-[collapsible=icon]:inline-flex">BW</span>
          </SidebarGroupLabel>
          <SidebarGroupLabel className="text-white/40">
            Menu
          </SidebarGroupLabel>
          <SidebarMenu>
            {menus.map((menu, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild title={menu.name} isActive={isActive(menu.link)}>
                  <Link href={menu.link} className="min-h-14 flex items-center gap-2 w-full border-transparent text-white hover:border-white/8 hover:bg-white/6 hover:text-white">
                    {menu.icon}
                    <span className="text-sm">{menu.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* main end */}

        {/* playlist */}
        <SidebarGroup className="pt-0">
          <SidebarGroupLabel className="flex justify-between text-white/40 group-data-[collapsible=icon]:hidden">
            Playlists <CreatePlaylist />
          </SidebarGroupLabel>
          <SidebarMenu>
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <SidebarMenuItem key={playlist.id}>
                  <div className={`min-h-14 flex items-center gap-2 rounded-2xl border px-2 py-2 transition-colors group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:min-h-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 ${isPlaylistActive(playlist.id) ? "border-white/14 bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.08)]" : "border-transparent text-white hover:border-white/8 hover:bg-white/6"}`}>
                    <Image src={Ph} alt="thumbnail" className="size-10 shrink-0 rounded-xl object-cover" title={playlist.name} priority />
                    <Link href={`/${playlist.id}`} className="min-w-0 flex flex-1 flex-col truncate group-data-[collapsible=icon]:hidden">
                      <span className={`text-sm font-medium truncate hover:underline ${isPlaylistActive(playlist.id) ? "text-black" : "text-white"}`}>{playlist.name}</span>
                      <span className={`text-xs truncate ${isPlaylistActive(playlist.id) ? "text-black/60" : "text-white/55"}`}>
                        Created in {new Date(playlist.createdAt).getFullYear()}
                      </span>
                    </Link>
                    <div className="flex items-center group-data-[collapsible=icon]:hidden">
                      <AddPlaylistSong playlist={playlist} />
                      <DeletePlaylist playlist={playlist} />
                    </div>
                  </div>
                </SidebarMenuItem>
              ))
            ) : (
              <span className="ms-2 text-sm text-white/45 group-data-[collapsible=icon]:hidden">No Playlist Available</span>
            )}
          </SidebarMenu>
        </SidebarGroup>
        {/* playlist end */}
      </SidebarContent>
    </Sidebar >
  )
}
