"use client";

import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { mutate } from "swr";
import { toast } from "sonner";
import { Music2, UploadCloud, Disc3 } from "lucide-react";

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

    toast.promise(
      (async () => {
        dispatch({ type: 'LOADING' });

        try {
          if (!state.audioUrl) {
            throw new Error("Please choose a song file");
          }

          const uploaded = await startUpload([state.audioUrl]);
          const audioUrl = uploaded?.[0]?.ufsUrl;
          const audioKey = uploaded?.[0]?.key;

          if (!audioUrl || !audioKey) {
            throw new Error("Upload failed");
          }

          const res = await fetch("/api/songs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: state.title,
              artist: state.artist,
              audioUrl,
              audioKey
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to save song");
          }

          await mutate("/api/songs");

          dispatch({ type: 'RESET' });
          router.refresh();

          return "Song added successfully";
        } finally {
          dispatch({ type: 'LOADING' });
        }
      })(),
      {
        loading: "Uploading song...",
        success: (message) => message,
        error: (error) => error instanceof Error ? error.message : "Error adding song",
      }
    );
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
      <div className="mb-2 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-white backdrop-blur-sm">
        <span className="text-sm font-semibold tracking-[0.16em] uppercase text-white/85">Add Song</span>
      </div>
      <div className="min-h-[38.4rem] overflow-hidden rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="grid min-h-[38.4rem] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_32%)]" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
                  <Disc3 size={14} className="text-green-400" />
                  Upload Studio
                </div>
                <div className="space-y-3">
                  <h1 className="max-w-md text-3xl font-semibold leading-tight md:text-4xl">
                    Drop in your next track and keep the library moving.
                  </h1>
                  <p className="max-w-lg text-sm leading-6 text-white/65">
                    Add title, artist, and your audio file in one place. The rest of your music flow stays exactly the same.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Music2 size={16} className="text-green-400" />
                    Track Details
                  </div>
                  <p className="text-sm text-white/60">
                    Keep song names and artist labels neat so your list stays easy to scan.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <UploadCloud size={16} className="text-blue-400" />
                    Audio Upload
                  </div>
                  <p className="text-sm text-white/60">
                    MP3 upload stays simple, with the same save flow you already have.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-black/20 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6">
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">Song Form</p>
                <h2 className="mt-2 text-2xl font-semibold">Add a new song</h2>
                <p className="mt-2 text-sm text-white/60">
                  Fill out the fields below and upload your audio file.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="title" className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/50">Title</span>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 focus:outline-0 focus:ring-2 focus:ring-green-400/60"
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
                <label htmlFor="artist" className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/50">Artist</span>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 focus:outline-0 focus:ring-2 focus:ring-green-400/60"
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
                <label htmlFor="thumbnail" className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/50">Thumbnail</span>
                  <input
                    type="file"
                    className="w-full rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/35 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-white/70"
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
                <label htmlFor="song" className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/50">Song</span>
                  <input
                    type="file"
                    className="w-full cursor-pointer rounded-xl border border-dashed border-green-400/35 bg-green-400/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-green-400 file:px-3 file:py-2 file:text-sm file:font-medium file:text-black"
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
                  <p className="mt-2 text-xs text-white/45">
                    Supported format: MP3
                  </p>
                </label>
                <Button
                  className="h-12 w-full rounded-xl bg-green-400 font-semibold text-black hover:bg-green-300"
                  disabled={state.loading}
                >
                  {state.loading ? "Saving..." : "Submit"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddSongClient
