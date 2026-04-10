"use client";

import { Pause, Play, SkipBack, SkipForward, VolumeX, Volume, Volume1, Volume2 } from "lucide-react";
import { formatTime } from "@/utils/formatTime";
import { Song } from "@prisma/client";
import { Slider } from "@/components/ui/slider";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import Image from "next/image";
import Ph from "@/images/placeholder.png";

const Player = () => {
  const {
    toggleVolume,
    audio,
    seek,
    playPrev,
    playNext,
    volume,
    duration,
    currentTime,
    selectSong,
    playing
  } = useAudioPlayer<Song>();

  const volumeIcon = () => {
    if (volume === 0) return <VolumeX />;
    if (volume > 0 && volume <= 0.3) return <Volume />;
    if (volume > 0.3 && volume <= 0.7) return <Volume1 />;
    
    return <Volume2 />;
  };

  return (
    <>
      <div className="flex flex-row items-center gap-3">
        <Image src={Ph} alt="thumbnail" className="h-16 w-16" priority />
        <div className="flex flex-col">
          <span className="font-normal text-sm">{selectSong?.title}</span>
          <span className="font-light text-sm">{selectSong?.artist}</span>
        </div>
      </div>
      <div className="px-5 flex flex-col justify-center gap-2">
        <div className="flex flex-row justify-center gap-3">
          <button onClick={playPrev} className="cursor-pointer">
            <SkipBack fill="true" className="p-1 rounded-full" size={30} />
          </button>
          <button onClick={audio} className="cursor-pointer">
            {playing ? <Pause fill="true" className="bg-white p-1 rounded-full" size={30} /> : <Play fill="true" className="bg-white p-1 rounded-full" size={30} />}
          </button>
          <button onClick={playNext} className="cursor-pointer">
            <SkipForward fill="true" className="p-1 rounded-full" size={30} />
          </button>
        </div>
        <div className="flex flex-row items-center gap-3">
          <span className="text-xs">{formatTime(currentTime)}</span>
          {/* Guard against a zero-duration slider so seeking remains interactive once metadata loads. */}
          <Slider className="w-full cursor-pointer" max={duration || 1} value={[currentTime]} onValueChange={(v) => seek(v[0])} />
          <span className="text-xs">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end px-5 gap-3">
        {volumeIcon()}
        <Slider className="w-1/3 cursor-pointer" max={1} value={[volume]} step={0.01} onValueChange={(v) => toggleVolume(v[0] ?? 0)} />
      </div>
    </>
  )
}

export default Player;
