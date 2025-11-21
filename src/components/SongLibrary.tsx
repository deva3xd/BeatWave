import React, { useState } from "react";
import { Pause, Play, EllipsisVertical, Trash } from "lucide-react";
import { Song } from "@prisma/client";
import { mutate } from "swr";
import Image from "next/image";
import Ph from "@/images/placeholder.png";
import useSWR from "swr";

type SongResponse = {
  songs: Song[]
};

type headerProps = {
  isPlaying: boolean;
  songState: {
    value: Song | null;
    set: (song: Song) => void;
  },
  handleClick: (song: Song) => void;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const SongLibrary = ({ songState, isPlaying, handleClick }: headerProps) => {
  const { data } = useSWR<SongResponse>('/api/songs', fetcher);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  // toggle menu
  const handleToggleMenu = (songId: number) => {
    setOpenMenu(prevId => (prevId === songId ? null : songId));
  };

  // delete
  const handleDelete = async (e: React.FormEvent, id: number) => {
    e.preventDefault();

    await fetch("/api/songs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
      }),
    });

    mutate("/api/songs");
  };

  if (!data) return null;

  return (
    <div className="grid grid-cols-6 max-w-screen-lg overflow-y-auto py-2 gap-2">
      {data?.songs.length > 0 ? (
        data.songs.map((song) => {
          return (
            <div key={song.id} className="flex flex-col items-center mb-2">
              <div className="relative group h-36 w-36">
                <Image
                  src={Ph}
                  alt="thumbnail"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  fill
                />
                <button
                  onClick={() => handleToggleMenu(song.id)}
                  className={`absolute top-1 right-1 ${openMenu === song.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity bg-black/50 hover:cursor-pointer rounded-full p-1`}
                >
                  <EllipsisVertical className="text-white" size={16} />
                </button>

                {/* dropdown menu */}
                {openMenu === song.id && (
                  <div className="absolute top-8 right-1 bg-background text-white shadow-lg rounded-sm rounded-tr-none text-sm py-2 px-3  z-10">
                    <button onClick={(e) => handleDelete(e, song.id)} className="flex items-center gap-1 hover:text-red-500 cursor-pointer">
                      <Trash size={15} />
                      Delete
                    </button>
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
                  className="bg-green-500 rounded-full p-1 cursor-pointer text-black hover:bg-green-500/75"
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