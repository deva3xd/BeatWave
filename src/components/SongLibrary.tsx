import React, { useState } from "react";
import { Pause, Play, EllipsisVertical } from "lucide-react";
import { Song } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image";
import Ph from "@/images/placeholder.png";

type headerProps = {
  songs: Song[];
  isPlaying: boolean;
  songState: {
    value: Song | null;
    set: (song: Song) => void;
  },
  handleClick: (song: Song) => void;
}

const SongLibrary = ({ songs, songState, isPlaying, handleClick }: headerProps) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="grid grid-cols-6 max-w-screen-lg overflow-y-auto py-2 gap-2">
      {songs && songs.length > 0 ? (
        songs.map((song) => {
          return (
            <div key={song.id} className="flex flex-col items-center mb-2">
              <div className="relative group h-36 w-36">
                <Image
                  src={Ph}
                  alt="thumbnail"
                  priority
                  fill
                />
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:cursor-pointer rounded-full p-1"
                >
                  <EllipsisVertical className="text-white" size={16} />
                </button>

                {/* dropdown menu */}
                {openMenu && (
                  <div className="absolute top-8 right-1 bg-background text-white shadow-lg rounded-sm rounded-tr-none py-2 px-3 text-sm z-10">
                    <div className="flex items-center gap-1">
                      <Checkbox />
                      Playlist 1
                    </div>
                  </div>
                )}
              </div>

              {/* info + control */}
              <div className="flex flex-row justify-between items-center w-36 mt-2">
                <div className="flex flex-col w-[70%]">
                  <span
                    className="font-normal text-sm line-clamp-1"
                    title={song.title}
                  >
                    {song.title}
                  </span>
                  <span className="font-light text-xs line-clamp-1">
                    {song.artist}
                  </span>
                </div>
                <button
                  onClick={() => handleClick(song)}
                  className="bg-green-500 rounded-full p-1 cursor-pointer text-black"
                >
                  {songState.value?.id === song.id && isPlaying ? (
                    <Pause size={14} fill="true" />
                  ) : (
                    <Play size={14} fill="true" />
                  )}
                </button>
              </div>
            </div>
          )
        })
      ) : (
        <span className="text-base p-2">No Song Available</span>
      )}
    </div>
  )
}

export default SongLibrary;