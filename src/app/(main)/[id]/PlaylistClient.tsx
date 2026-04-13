"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Prisma } from '@prisma/client';
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Song } from "@prisma/client";
import useSWR from "swr";
import SongLibrary from "@/components/SongLibrary";

type PlaylistSongResponse = Prisma.PlaylistSongGetPayload<{
  include: {
    playlist: true;
    song: true;
  }
}>

const fetcher = (url: string) => fetch(url).then(res => res.json());

type PlaylistClientProps = {
  playlistName: string;
};

export default function PlaylistClient({ playlistName }: PlaylistClientProps) {
  const {
    selected,
    setQueue,
    selectSong,
    playing
  } = useAudioPlayer<Song>();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data } = useSWR<{ playlistSong: PlaylistSongResponse[] }>(`/api/playlist-song/${id}`, fetcher);
  const songs = useMemo(() => data?.playlistSong.map(ps => ps.song) ?? [], [data?.playlistSong]);

  useEffect(() => {
    setQueue(songs);
  }, [songs, setQueue]);

  return (
    <>
      <div className="mb-2 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-white backdrop-blur-sm">
        <span className="text-sm font-semibold tracking-[0.16em] uppercase text-white/85">{playlistName}</span>
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
          data={songs}
        />
      </div>
    </>
  )
}
