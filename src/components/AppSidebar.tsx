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
import CreatePlaylist from "./modals/CreatePlaylist";
import AddSong from "./modals/AddSong";
import { useEffect, useState } from "react";
import { Playlist } from "@prisma/client";
import Ph from "@/images/placeholder.png";

type PlaylistWithYear = Playlist & {
  year: number;
};

export function AppSidebar() {
  const [playlists, setPlaylists] = useState<PlaylistWithYear[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/playlists");
        const data = await res.json();
        setPlaylists(data.playlists);
      } catch (err) {
        console.log("error: " + err);
      }
    };
    fetchData();
  }, []);

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
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <SidebarMenuItem className="ms-4 mb-1" key={playlist.id}>
                    <div className="flex flex-row gap-2">
                      <Image src={Ph} alt="thumbnail" className="h-12 w-12 rounded-xs" priority />
                      <div className="flex flex-col justify-center">
                        <span className="font-semibold text-base text-green-500">{playlist.name}</span>
                        <span className="font-normal text-xs text-gray-200">Created in {playlist.year}</span>
                      </div>
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
    </Sidebar>
  );
}
