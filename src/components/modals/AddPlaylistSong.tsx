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

const fetcher = (url: string) => fetch(url).then(res => res.json());

const AddPlaylistSong = ({ playlist }: headerProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data } = useSWR<{ songs: Song[] }>('/api/songs', fetcher);
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
      <DialogContent className="rounded-lg">
        <DialogHeader className="text-white">
          <div className="flex items-center justify-between">
            <DialogTitle>Add Song to Playlist</DialogTitle>
            <Button variant="danger" size="icon" onClick={() => dispatch({ type: 'MODAL_OPEN', payload: false })}>
              <XIcon size={14} />
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {songs.map((song) => (
            <div key={song.id} className="flex items-center gap-3 text-white mb-2">
              <Checkbox id={`${song.id}`} onCheckedChange={() => dispatch({ type: 'TOGGLE_SONG', payload: song.id })} />
              <Label htmlFor={`${song.id}`}>{song.title}</Label>
            </div>
          ))}
          <Button className="w-full mt-2">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlaylistSong;