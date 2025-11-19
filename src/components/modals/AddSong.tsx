import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, XIcon } from "lucide-react";
import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const initialState = {
  title: '',
  artist: '',
  thumbnail: null,
  audio: null,
  loading: false,
  modalOpen: false
};

type StateSong = {
  title: string;
  artist: string;
  thumbnail: File | null;
  audio: File | null;
  loading: boolean;
  modalOpen: boolean;
};

type ActionSong =
  | { type: 'TITLE'; payload: string }
  | { type: 'ARTIST'; payload: string }
  | { type: 'THUMBNAIL', payload: File | null }
  | { type: 'AUDIO', payload: File | null }
  | { type: 'LOADING' }
  | { type: 'MODAL_OPEN', payload: boolean };

const reducer = (state: StateSong, action: ActionSong) => {
  switch (action.type) {
    case 'TITLE':
      return { ...state, title: action.payload };
    case 'ARTIST':
      return { ...state, artist: action.payload };
    case 'THUMBNAIL':
      return { ...state, thumbnail: action.payload };
    case 'AUDIO':
      return { ...state, audio: action.payload };
    case 'LOADING':
      return { ...state, loading: !state.loading };
    case 'MODAL_OPEN':
      return { ...state, modalOpen: action.payload };
    default:
      throw new Error('unexpected action');
  }
};

const AddSong = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'LOADING' });

    if (!state.audio) return;

    // upload file to uploadthing
    const uploaded = await startUpload([state.audio]);
    const audioUrl = uploaded?.[0]?.ufsUrl;

    if (!audioUrl) return;

    await fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: state.title,
        artist: state.artist,
        audio: audioUrl,
      }),
    });

    dispatch({ type: 'LOADING' });
    dispatch({ type: 'MODAL_OPEN', payload: false });
    router.push("/");
  };

  const { startUpload } = useUploadThing("fileUploader", {
    onClientUploadComplete: (res) => {
      console.log("Files:", res);
    },
    onUploadError: (error) => {
      console.log("Error: ", error);
    },
  });
  
  return (
    <Dialog open={state.modalOpen} onOpenChange={() => dispatch({ type: 'MODAL_OPEN', payload: true })}>
      <DialogTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          <Plus size={20} />
          <span className="text-sm">Add Song</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-white">
          <div className="flex items-center justify-between">
            <DialogTitle>Add Song</DialogTitle>
            <button onClick={() => dispatch({type: 'MODAL_OPEN', payload: false})} className="text-white p-1 bg-red-600 hover:opacity-85 rounded-full cursor-pointer">
              <XIcon size={14} />
            </button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">
            <span className="text-xs text-white/50">Title</span>
            <input
              type="text"
              className="bg-foreground w-full text-white border border-white/50 px-3 py-2 rounded-sm mb-2 focus:outline-0 focus:border-white"
              id="title"
              name="title"
              placeholder="title"
              value={state.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({ type: 'TITLE', payload: e.target.value })
              }
              required
            />
          </label>
          <label htmlFor="artist">
            <span className="text-xs text-white/50">Artist</span>
            <input
              type="text"
              className="bg-foreground w-full text-white border border-white/50 px-3 py-2 rounded-sm mb-2 focus:outline-0 focus:border-white"
              id="artist"
              name="artist"
              placeholder="artist"
              value={state.artist}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch({ type: 'ARTIST', payload: e.target.value })
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
          <label htmlFor="song">
            <span className="text-xs text-white/50">Song</span>
            <input
              type="file"
              className="bg-foreground w-full text-white border border-white/50 px-3 py-2 rounded-sm mb-2 focus:outline-0 focus:border-white cursor-pointer"
              id="song"
              name="song"
              accept=".mp3,audio/mpeg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files?.[0]) {
                  dispatch({ type: 'AUDIO', payload: e.target.files[0] });
                }
              }}
              required
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

export default AddSong;