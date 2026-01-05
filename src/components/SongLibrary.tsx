import React, { useState } from "react";
import { Pause, Play, EllipsisVertical, Trash } from "lucide-react";
import { Song } from "@prisma/client";
import { mutate } from "swr";
import Image from "next/image";
import Ph from "@/images/placeholder.png";
import { toast } from "sonner";

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
  const [deleting, setDeleting] = useState<boolean>(false);

  // toggle menu
  const handleToggleMenu = (songId: number) => {
    setOpenMenu(prevId => (prevId === songId ? null : songId));
  };

  // delete
  const handleDelete = async (e: React.FormEvent, id: number, key: string) => {
    e.preventDefault();

    toast.promise(
      (async () => {
        setDeleting(true);
        const res = await fetch("/api/songs", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, key }),
        });

        if (!res.ok) throw new Error("Failed");

        setDeleting(false);
        mutate("/api/songs");

        return "Song deleted";
      })(),
      {
        loading: "Deleting...",
        success: (msg) => msg,
        error: "Error deleting song",
      }
    );
  };

  return (
    <div className="grid grid-cols-6 max-w-screen-lg overflow-y-auto p-2 gap-2">
      {data.length > 0 ? (
        data.map((s) => {
          return (
            <div key={s.id} className="flex flex-col items-center mb-2">
              <div className="relative group h-36 w-36">
                <Image
                  src={Ph}
                  alt="thumbnail"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  fill
                />
                <button
                  onClick={() => handleToggleMenu(s.id)}
                  className={`absolute top-1 right-1 ${openMenu === s.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity bg-black/50 hover:cursor-pointer rounded-full p-1`}
                >
                  <EllipsisVertical className="text-white" size={16} />
                </button>

                {/* dropdown menu */}
                {openMenu === s.id && (
                  <div className="absolute top-8 right-1 bg-background text-white shadow-lg rounded-sm rounded-tr-none text-sm py-2 px-3  z-10">
                    <button onClick={(e) => handleDelete(e, s.id, s.audioKey)} className={`flex items-center gap-1 ${deleting ? 'cursor-not-allowed opacity-25' : 'cursor-pointer hover:text-red-500 '}`} disabled={deleting}>
                      <Trash size={15} />
                      {deleting ? 'Loading' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>

              {/* info + control */}
              <div className="flex flex-row justify-between items-center w-36 mt-2">
                <div className="flex flex-col w-[70%]">
                  <span
                    className="font-normal text-sm line-clamp-1"
                    title={s.title}
                  >
                    {s.title}
                  </span>
                  <span className="font-light text-xs line-clamp-1">
                    {s.artist}
                  </span>
                </div>
                <button
                  onClick={() => handleClick(s)}
                  className="bg-green-500 rounded-full p-1 cursor-pointer text-black hover:bg-green-500/75"
                >
                  {songState.value?.id === s.id && isPlaying ? (
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