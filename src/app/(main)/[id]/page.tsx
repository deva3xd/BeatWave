"use client";

import useSWR from "swr";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SongLibrary from "@/components/SongLibrary";
import Player from "@/components/Player";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { Prisma } from '@prisma/client';
import useSong from "@/stores/useSong";
import useAudio from "@/stores/useAudio";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Song } from "@prisma/client";

type PlaylistSongResponse = Prisma.PlaylistSongGetPayload<{
  include: {
    playlist: true;
    song: true;
  }
}>

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PlaylistPage() {
  const {
    toggleVolume,
    selected,
    audio,
    seek,
    audioRef,
    volume,
    duration,
    currentTime,
    selectSong,
    playing
  } = useAudioPlayer<Song>();
  const params = useParams<{ id: string }>()
  const id = Number(params.id); // change type data id
  const { data } = useSWR<{ playlistSong: PlaylistSongResponse[] }>(`/api/playlist-song/${id}`, fetcher);
  const title = data?.playlistSong.at(0); // extract playlist name
  const songs = data?.playlistSong.map(ps => ps.song) ?? []; // make song array

  return (
    <>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-white bg-black hover:text-white/50 hover:bg-transparent cursor-pointer" />
          <span className="font-semibold text-sm text-white">{title?.playlist.name}</span>
        </div>
        <div className="text-white bg-foreground">
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
        <div
          className={`fixed bottom-0 right-0 text-white bg-background p-4 w-full z-50 ${selectSong ? "grid grid-cols-3" : "hidden"}`}
        >
          <Player
            selectSong={selectSong}
            handleAudio={audio}
            isPlaying={playing}
            duration={duration}
            currentTime={currentTime}
            handleSeek={seek}
            handleVolume={toggleVolume}
            volume={volume}
          />
        </div>
      </div>
      <audio ref={audioRef} src={selectSong?.audioUrl} />
    </>
  )
}