import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useSWR from "swr";
import { Plus, XIcon } from "lucide-react";
import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { Song, Playlist } from "@prisma/client";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { getSongs } from "@/lib/getSongs";

const initialState = {
  songIds: [],
  modalOpen: false
};

type headerProps = {
  playlist: Playlist;
};

type StateSong = {
  songIds: number[];
  modalOpen: boolean;
};

type ActionSong =
  | { type: 'TOGGLE_SONG', payload: number }
  | { type: 'MODAL_OPEN', payload: boolean }
  | { type: 'RESET' };

const reducer = (state: StateSong, action: ActionSong) => {
  switch (action.type) {
    case 'TOGGLE_SONG':
      return {
        ...state,
        songIds: state.songIds.includes(action.payload)
          ? state.songIds.filter(id => id !== action.payload)
          : [...state.songIds, action.payload],
      };
    case 'MODAL_OPEN':
      return { ...state, modalOpen: action.payload };
    case 'RESET':
      return initialState;
    default:
      throw new Error('unexpected action');
  }
};

const AddPlaylistSong = ({ playlist }: headerProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data } = useSWR<{ songs: Song[] }>("/api/songs", getSongs);
  const songs = data?.songs ?? [];
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/playlist-song", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        song_id: state.songIds,
        playlist_id: playlist.id,
      }),
    });

    dispatch({ type: 'MODAL_OPEN', payload: false });
    dispatch({ type: 'RESET' });
    router.refresh();
  };

  return (
    <Dialog open={state.modalOpen} onOpenChange={() => dispatch({ type: 'MODAL_OPEN', payload: true })}>
      <DialogTrigger className="cursor-pointer size-6 text-sm hover:text-green-500" title="Add Song">
        <Plus size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add Song to Playlist</DialogTitle>
            <Button variant="danger" size="icon" className="border border-white/10 bg-white/6 hover:bg-red-500" onClick={() => dispatch({ type: 'MODAL_OPEN', payload: false })}>
              <XIcon size={14} />
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {songs.map((song) => (
            <div key={song.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-white">
              <Checkbox id={`${song.id}`} onCheckedChange={() => dispatch({ type: 'TOGGLE_SONG', payload: song.id })} />
              <Label htmlFor={`${song.id}`} className="cursor-pointer">{song.title}</Label>
            </div>
          ))}
          <Button className="mt-2 h-11 w-full rounded-xl bg-green-400 font-semibold text-black hover:bg-green-300">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlaylistSong;
