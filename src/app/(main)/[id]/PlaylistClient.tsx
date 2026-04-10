"use client";

import { useEffect, useMemo } from "react";
import useSWR from "swr";
import SongLibrary from "@/components/SongLibrary";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { Prisma } from '@prisma/client';
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Song } from "@prisma/client";

type PlaylistSongResponse = Prisma.PlaylistSongGetPayload<{
  include: {
    playlist: true;
    song: true;
  }
}>

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PlaylistClient() {
  const {
    selected,
    setQueue,
    selectSong,
    playing
  } = useAudioPlayer<Song>();
  const params = useParams<{ id: string }>();
  const id = Number(params.id); // change type data id
  const { data } = useSWR<{ playlistSong: PlaylistSongResponse[] }>(`/api/playlist-song/${id}`, fetcher);
  const title = data?.playlistSong.at(0); // extract playlist name
  const songs = useMemo(() => data?.playlistSong.map(ps => ps.song) ?? [], [data?.playlistSong]); // make song array

  useEffect(() => {
    // keep prev/next aligned with the playlist currently being viewed.
    setQueue(songs);
  }, [songs, setQueue]);

  return (
    <>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-white bg-black hover:text-white/50 hover:bg-transparent cursor-pointer" />
        <span className="font-semibold text-sm text-white">{title?.playlist.name}</span>
      </div>
      <div className="text-white bg-foreground rounded-md h-[38.4rem]">
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
