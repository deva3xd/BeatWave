import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useReducer } from "react";

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
  | { type: 'MODAL_OPEN', payload: boolean };

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
    router.push("/");
  };

  return (
    <Dialog open={state.modalOpen} onOpenChange={() => dispatch({ type: 'MODAL_OPEN', payload: true })}>
      <DialogTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          <Plus size={20} />
          <span className="text-sm">Create Playlist</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-white">
          <div className="flex items-center justify-between">
            <DialogTitle>Create Playlist</DialogTitle>
            <button onClick={() => dispatch({ type: 'MODAL_OPEN', payload: false })} className="text-white p-1 bg-red-600 hover:opacity-85 rounded-full cursor-pointer">
              <XIcon size={14} />
            </button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="bg-white font-semibold text-black w-full rounded-sm cursor-pointer px-3 py-2 hover:opacity-85 disabled:cursor-default disabled:opacity-50 mt-2"
            disabled={state.loading}
          >
            {state.loading ? "Saving..." : "Submit"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePlaylist;