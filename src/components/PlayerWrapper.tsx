"use client";

import Player from './Player';
import { Song } from "@prisma/client";
import { useAudioPlayer } from "@/hooks/use-audio-player";

const PlayerWrapper = () => {
  const { selectSong, setAudioRef } = useAudioPlayer<Song>({ controller: true });

  return (
    <>
      <audio ref={setAudioRef} />
      <div className={`fixed bottom-0 right-0 text-white bg-background p-4 w-full z-50 ${selectSong ? "grid grid-cols-3" : "hidden"}`}>
        <Player />
      </div>
    </>
  )
}

export default PlayerWrapper;
