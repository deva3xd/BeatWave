import { Playlist } from "@prisma/client";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import Ph from "@/images/placeholder.png";
import AddPlaylistSong from "./modals/AddPlaylistSong";
import CreatePlaylist from "./modals/CreatePlaylist";
import DeletePlaylist from "./modals/DeletePlaylist";

export function NavPlaylists({ playlists }: { playlists: Playlist[]; }) {
  return (
    <SidebarGroup className="pt-0">
      <SidebarGroupLabel className="text-xs font-light text-gray-200 flex justify-between group-data-[collapsible=icon]:hidden">
        Playlists <CreatePlaylist />
      </SidebarGroupLabel>
      <SidebarMenu>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <SidebarMenuItem key={playlist.id}>
              <div className="flex justify-between items-center gap-2 bg-gray-500/5 hover:bg-gray-500/10">
                <Image src={Ph} alt="thumbnail" className="w-12 shrink-0 rounded-xs" title={playlist.name} priority />
                <Link href={`/${playlist.id}`} className="flex flex-col truncate hover:underline">
                  <span className="text-base truncate">{playlist.name}</span>
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
  )
}