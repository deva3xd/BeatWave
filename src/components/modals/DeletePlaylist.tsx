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
import { Playlist } from "@prisma/client";

type headerProps = {
  playlist: Playlist;
};

const DeletePlaylist = ({ playlist }: headerProps) => {
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleDelete = async (e: React.FormEvent, id: number) => {
    e.preventDefault();

    toast.promise(
      (async () => {
        setDeleting(true);
        const res = await fetch("/api/playlists", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) throw new Error("Failed");

        setDeleting(false);
        mutate("/api/playlists");

        return "Playlist deleted";
      })(),
      {
        loading: "Deleting...",
        success: (msg) => msg,
        error: "Error deleting playlist",
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="none" size="icon" className="cursor-pointer hover:text-red-600" title="Delete Playlist">
          <Trash size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete playlist and remove data from servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-none cursor-pointer text-white bg-primary hover:bg-primary/90 hover:text-white">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => handleDelete(e, playlist.id)} className="cursor-pointer text-white bg-red-600 hover:bg-red-700 hover:text-white" disabled={deleting}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeletePlaylist;