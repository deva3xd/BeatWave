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
import useSWR from "swr";
import { mutate } from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash } from "lucide-react";
import { Playlist } from "@prisma/client";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import Ph from "@/images/placeholder.png";

type PlaylistResponse = {
  playlists: Playlist[];
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

const PlaylistLibrary = () => {
  const { data } = useSWR<PlaylistResponse>('/api/playlists', fetcher);
  const [deleting, setDeleting] = useState<boolean>(false);

  // delete
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

        const data = await res.json();
        setDeleting(false);
        mutate("/api/playlists");

        return `Playlist deleted`;
      })(),
      {
        loading: "Deleting...",
        success: (msg) => msg,
        error: "Error deleting playlist",
      }
    );
  };

  if (!data) return null;

  return (
    <>
      <span className="text-sm font-light text-gray-200">
        Playlists
      </span>
      {data.playlists.length > 0 ? (
        data.playlists.map((playlist) => (
          <SidebarMenuItem className="ms-4 mb-1" key={playlist.id}>
            <div className="flex gap-2 relative hover:bg-green-500/25">
              <Image src={Ph} alt="thumbnail" className="h-12 w-12 rounded-xs" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
              <div className="flex justify-between w-full pe-1">
                <Link href={`/${playlist.id}`} className="flex flex-col justify-center">
                  <span className="font-semibold text-base text-white">{playlist.name}</span>
                  <span className="font-normal text-xs text-gray-200">Created in {new Date(playlist.createdAt).getFullYear()}</span>
                </Link>
                <div className="flex items-center">
                  <Button variant="none" size="icon" onClick={() => console.log('test')} className="text-white cursor-pointer">
                    <Plus />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="none" size="icon" className="text-white cursor-pointer hover:text-red-600">
                        <Trash />
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
                </div>
              </div>
            </div>
          </SidebarMenuItem>
        ))
      ) : (
        <span className="text-sm ms-4">No Playlist Available</span>
      )}
    </>
  )
}

export default PlaylistLibrary;