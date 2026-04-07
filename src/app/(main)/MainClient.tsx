"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Song } from "@prisma/client";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import useSWR from "swr";
import SongLibrary from "@/components/SongLibrary";
import Player from "@/components/Player";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const MainClient = () => {
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
  const { data } = useSWR<{ songs: Song[] }>('/api/songs', fetcher);

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
      <audio ref={audioRef} src={selectSong?.audioUrl} />
    </>
  );
};

export default MainClient;
