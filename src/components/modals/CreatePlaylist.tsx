import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CirclePlus, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { Button } from "../ui/button";

const initialState = {
  name: '',
  thumbnail: null,
  loading: false,
  modalOpen: false
};

type StatePlaylist = {
  name: string;
  thumbnail: File | null;
  loading: boolean;
  modalOpen: boolean;
};

type ActionPlaylist =
  | { type: 'NAME'; payload: string }
  | { type: 'THUMBNAIL', payload: File | null }
  | { type: 'LOADING' }
  | { type: 'MODAL_OPEN', payload: boolean }
  | { type: 'RESET' };

const reducer = (state: StatePlaylist, action: ActionPlaylist) => {
  switch (action.type) {
    case 'NAME':
      return { ...state, name: action.payload };
    case 'THUMBNAIL':
      return { ...state, thumbnail: action.payload };
    case 'LOADING':
      return { ...state, loading: !state.loading };
    case 'MODAL_OPEN':
      return { ...state, modalOpen: action.payload };
    case 'RESET':
      return initialState;
    default:
      throw new Error('unexpected action');
  }
};

const CreatePlaylist = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'LOADING' });

    await fetch("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: state.name,
      }),
    });

    dispatch({ type: 'LOADING' });
    dispatch({ type: 'MODAL_OPEN', payload: false });
    dispatch({ type: 'RESET' });
    router.refresh();
  };

  return (
    <Dialog open={state.modalOpen} onOpenChange={() => dispatch({ type: 'MODAL_OPEN', payload: true })}>
      <DialogTrigger className="cursor-pointer hover:opacity-75" title="Create a playlist">
        <CirclePlus size={16} />
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader className="text-white">
          <div className="flex items-center justify-between">
            <DialogTitle>Create Playlist</DialogTitle>
            <Button variant="danger" size="icon" onClick={() => dispatch({ type: 'MODAL_OPEN', payload: false })}>
              <XIcon size={14} />
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogDescription>
            <label htmlFor="name">
              <span className="text-xs text-white/50">Name</span>
              <input
                type="text"
                className="bg-foreground w-full text-white border border-white/50 px-3 py-2 rounded-sm mb-2 focus:outline-0 focus:border-white"
                id="name"
                name="name"
                placeholder="name"
                value={state.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch({ type: 'NAME', payload: e.target.value })
                }
                required
              />
            </label>
            <label htmlFor="thumbnail">
              <span className="text-xs text-white/50">Thumbnail</span>
              <input
                type="file"
                className="bg-foreground w-full text-white/50 border border-white/50 px-3 py-2 rounded-sm mb-2 focus:outline-0 focus:border-white"
                id="thumbnail"
                name="thumbnail"
                accept=".jpg,.jpeg"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files?.[0]) {
                    dispatch({ type: 'THUMBNAIL', payload: e.target.files[0] });
                  }
                }}
                disabled
              />
            </label>
            <Button
              className="w-full mt-2"
              disabled={state.loading}
            >
              {state.loading ? "Saving..." : "Submit"}
            </Button>
          </DialogDescription>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePlaylist;