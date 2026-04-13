import React, { useState } from "react";
import { Pause, Play, EllipsisVertical } from "lucide-react";
import { Song } from "@prisma/client";
import Image from "next/image";
import Ph from "@/images/placeholder.png";
import DeleteSong from "./modals/DeleteSong";

type headerProps = {
  isPlaying: boolean;
  songState: {
    value: Song | null;
    set: (song: Song) => void;
  };
  handleClick: (song: Song) => void;
  data: Song[];
}

const SongLibrary = ({ songState, isPlaying, handleClick, data }: headerProps) => {
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  // toggle menu
  const handleToggleMenu = (songId: number) => {
    setOpenMenu(prevId => (prevId === songId ? null : songId));
  };

  return (
    <>
      {data.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 overflow-y-auto p-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {data.map((song) => (
            <div key={song.id} className="group rounded-[1.35rem] border border-white/8 bg-white/[0.04] p-3 transition-all hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/[0.06]">
              <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                <Image
                  src={Ph}
                  alt="thumbnail"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <button
                  onClick={() => handleToggleMenu(song.id)}
                  className={`absolute top-2 right-2 ${openMenu === song.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} rounded-full border border-white/10 bg-black/45 p-1.5 transition-opacity hover:cursor-pointer`}
                >
                  <EllipsisVertical className="text-white" size={16} />
                </button>

                {/* dropdown menu */}
                {openMenu === song.id && (
                  <div className="absolute top-11 right-2 z-10 rounded-2xl border border-white/10 bg-neutral-950/96 px-3 py-2 text-sm text-white shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                    <DeleteSong song={song} />
                  </div>
                )}
              </div>

              {/* info + control */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span
                    className="block text-sm font-medium line-clamp-1"
                    title={song.title}
                  >
                    {song.title}
                  </span>
                  <span className="block text-xs text-white/55 line-clamp-1">
                    {song.artist}
                  </span>
                </div>
                <button
                  onClick={() => handleClick(song)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-400 text-black shadow-[0_10px_20px_rgba(74,222,128,0.24)] cursor-pointer transition hover:bg-green-300"
                >
                  {songState.value?.id === song.id && isPlaying ? (
                    <Pause size={14} fill="true" />
                  ) : (
                    <Play size={14} fill="true" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center p-6 text-sm text-white/50">No Song Available</div>
      )}
    </>
  )
}

export default SongLibrary;
