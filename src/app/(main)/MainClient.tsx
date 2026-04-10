"use client";

import { useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Song } from "@prisma/client";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import useSWR from "swr";
import SongLibrary from "@/components/SongLibrary";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const MainClient = () => {
  const {
    selected,
    setQueue,
    selectSong,
    playing
  } = useAudioPlayer<Song>();
  const { data } = useSWR<{ songs: Song[] }>('/api/songs', fetcher);

  useEffect(() => {
    if (data?.songs) {
      // Refresh the shared queue when the user returns to the main song list from the sidebar.
      setQueue(data.songs);
    }
  }, [data?.songs, setQueue]);

  if (!data) return;

  return (
    <>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-white bg-black hover:text-white/50 hover:bg-transparent cursor-pointer" />
        <span className="font-semibold text-sm text-white">Song List</span>
      </div>
      <div className="text-white bg-foreground rounded-md h-[38.4rem]">
        <SongLibrary
          songState={{
            value: selectSong,
            set: (song) => selected(song),
          }}
          isPlaying={playing}
          handleClick={selected}
          data={data.songs}
        />
      </div>
    </>
  )
}

export default MainClient;
