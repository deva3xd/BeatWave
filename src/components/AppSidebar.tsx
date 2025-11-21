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
import { Playlist } from "@prisma/client";
import { useState } from "react";
import { EllipsisVertical, ListMusic, Trash } from "lucide-react";
import Image from "next/image";
import CreatePlaylist from "./modals/CreatePlaylist";
import AddSong from "./modals/AddSong";
import Ph from "@/images/placeholder.png";
import useSWR from "swr";
import { mutate } from "swr";

type PlaylistResponse = {
  playlists: Playlist[];
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function AppSidebar() {
  const { data } = useSWR<PlaylistResponse>('/api/playlists', fetcher);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const handleToggleMenu = (playlistId: number) => {
    setOpenMenu(prevId => (prevId === playlistId ? null : playlistId));
  };

  // delete
  const handleDelete = async (e: React.FormEvent, id: number) => {
    e.preventDefault();

    await fetch("/api/playlists", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
      }),
    });

    mutate("/api/playlists");
  };

  if (!data) return null;

  return (
    <Sidebar className="border-none">
      <SidebarContent className="bg-foreground text-white px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white font-semibold text-md border-b border-white rounded-none text-2xl flex flex-row justify-center uppercase">
            BeatWave
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="my-2">
              <span className="text-sm font-semibold text-gray-200">
                Menu
              </span>
              <SidebarMenuItem className="ms-4 mb-1">
                <div className="flex items-center gap-2 hover:opacity-75">
                  <ListMusic size={20} />
                  <span className="text-sm">Song List</span>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem className="ms-4 mb-1">
                <AddSong />
              </SidebarMenuItem>
              <SidebarMenuItem className="ms-4 mb-1">
                <CreatePlaylist />
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu className="my-2">
              <span className="text-sm font-semibold text-gray-200">
                Playlists
              </span>
              {data.playlists.length > 0 ? (
                data.playlists.map((playlist) => (
                  <SidebarMenuItem className="ms-4 mb-1" key={playlist.id}>
                    <div className="flex flex-row gap-2 relative hover:bg-green-500/25 cursor-pointer">
                      <Image src={Ph} alt="thumbnail" className="h-12 w-12 rounded-xs" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
                      <div className="flex flex-col justify-center">
                        <span className="font-semibold text-base text-green-500">{playlist.name}</span>
                        <span className="font-normal text-xs text-gray-200">Created in {new Date(playlist.createdAt).getFullYear()}</span>
                      </div>
                      <button
                        onClick={() => handleToggleMenu(playlist.id)}
                        className={`absolute top-1 right-1 ${openMenu === playlist.id ? 'opacity-100 bg-black/50' : 'opacity-25 hover:opacity-100'} transition-opacity hover:bg-black/50 hover:cursor-pointer rounded-full p-1`}
                      >
                        <EllipsisVertical size={16} />
                      </button>

                      {/* dropdown menu */}
                      {openMenu === playlist.id && (
                        <div className="absolute top-8 right-1 bg-background text-white shadow-lg rounded-sm rounded-tr-none text-sm py-2 px-3  z-10">
                          <button onClick={(e) => handleDelete(e, playlist.id)} className="flex items-center gap-1 hover:text-red-500 cursor-pointer">
                            <Trash size={15} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </SidebarMenuItem>
                ))
              ) : (
                <span className="text-sm ms-4">No Playlist Available</span>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar >
  )
}
