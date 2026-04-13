import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { mutate } from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { Song } from "@prisma/client";

type headerProps = {
  song: Song;
};

const DeleteSong = ({ song }: headerProps) => {
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleDelete = async (e: React.FormEvent, id: number) => {
    e.preventDefault();

    toast.promise(
      (async () => {
        setDeleting(true);
        try {
          const res = await fetch("/api/songs", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, key: song.audioKey }),
          });

          if (!res.ok) throw new Error("Failed");

          await mutate(
            "/api/songs",
            (currentData: { songs: Song[] } | undefined) => {
              if (!currentData) return currentData;

              return {
                ...currentData,
                songs: currentData.songs.filter((currentSong) => currentSong.id !== id),
              };
            },
            false
          );
          await mutate("/api/songs");

          return "Song deleted";
        } finally {
          setDeleting(false);
        }
      })(),
      {
        loading: "Deleting...",
        success: (msg) => msg,
        error: "Error deleting song",
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="none" size="icon" className="cursor-pointer hover:text-red-500 px-8" title="Delete Playlist">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this song?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete playlist and remove data from servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer rounded-xl border border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => handleDelete(e, song.id)} className="cursor-pointer rounded-xl bg-red-500 text-white hover:bg-red-400 hover:text-white" disabled={deleting}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteSong;
