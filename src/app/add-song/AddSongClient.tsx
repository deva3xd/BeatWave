"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const initialState = {
  title: '',
  artist: '',
  thumbnail: null,
  audioUrl: null,
  audioKey: '',
  loading: false,
};

type StateSong = {
  title: string;
  artist: string;
  thumbnail: File | null;
  audioUrl: File | null;
  audioKey: string;
  loading: boolean;
};

type ActionSong =
  | { type: 'TITLE'; payload: string }
  | { type: 'ARTIST'; payload: string }
  | { type: 'THUMBNAIL', payload: File | null }
  | { type: 'AUDIO', payload: File | null }
  | { type: 'LOADING' }
  | { type: 'RESET' };

const reducer = (state: StateSong, action: ActionSong) => {
  switch (action.type) {
    case 'TITLE':
      return { ...state, title: action.payload };
    case 'ARTIST':
      return { ...state, artist: action.payload };
    case 'THUMBNAIL':
      return { ...state, thumbnail: action.payload };
    case 'AUDIO':
      return { ...state, audioUrl: action.payload };
    case 'LOADING':
      return { ...state, loading: !state.loading };
    case 'RESET':
      return initialState;
    default:
      throw new Error('unexpected action');
  }
};

const AddSongClient = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'LOADING' });

    if (!state.audioUrl) return;

    // upload file to uploadthing
    const uploaded = await startUpload([state.audioUrl]);
    const audioUrl = uploaded?.[0]?.ufsUrl;
    const audioKey = uploaded?.[0]?.key;

    await fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: state.title,
        artist: state.artist,
        audioUrl: audioUrl,
        audioKey: audioKey
      }),
    });

    dispatch({ type: 'LOADING' });
    dispatch({ type: 'RESET' });
    router.refresh();
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
    <>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-white bg-black hover:text-white/50 hover:bg-transparent cursor-pointer" />
        <span className="font-semibold text-sm text-white">Add Song</span>
      </div>
      <div className="text-white bg-foreground rounded-md h-[38.4rem]">
        <div className="text-white text-lg flex justify-center">
          <div className="max-w-xl py-4">
            <form onSubmit={handleSubmit}>
              <div>
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
                <Button
                  className="w-full mt-2"
                  disabled={state.loading}
                >
                  {state.loading ? "Saving..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddSongClient