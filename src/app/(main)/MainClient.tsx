"use client";

import { useEffect } from "react";
import { Song } from "@prisma/client";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import useSWR from "swr";
import SongLibrary from "@/components/SongLibrary";
import { getSongs } from "@/lib/getSongs";

const MainClient = () => {
  const {
    selected,
    setQueue,
    selectSong,
    playing
  } = useAudioPlayer<Song>();
  const { data } = useSWR<{ songs: Song[] }>("/api/songs", getSongs);

  useEffect(() => {
    if (data?.songs) {
      // Refresh the shared queue when the user returns to the main song list from the sidebar.
      setQueue(data.songs);
    }
  }, [data?.songs, setQueue]);

  if (!data) return;

  return (
    <>
      <div className="mb-2 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-white backdrop-blur-sm">
        <span className="text-sm font-semibold tracking-[0.16em] uppercase text-white/85">Song List</span>
      </div>
      <div className="relative h-[38.4rem] overflow-hidden rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_26%)]" />
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
