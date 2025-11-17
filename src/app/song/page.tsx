"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

type StateSong = {
  title: string;
  artist: string;
  thumbnail: File | null;
  audio: File | null;
  loading: boolean;
};

type ActionSong = 
 | {type: 'TITLE'; payload: string}
 | {type: 'ARTIST'; payload: string}
 | {type: 'THUMBNAIL', payload: File | null}
 | {type: 'AUDIO', payload: File | null}
 | {type: 'LOADING'; payload: boolean}

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
    default:
      throw new Error('unexpected action');
  }
}

const initialState = {
  title: '',
  artist: '',
  thumbnail: null,
  audio: null,
  loading: false
}

const Song = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'LOADING', payload: true });

    if (!state.audio) return;

    // upload file to uploadthing
    const uploaded = await startUpload([state.audio]);
    const audioUrl = uploaded?.[0]?.ufsUrl;

    if (!audioUrl) return;

    await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: state.title,
        artist: state.artist,
        audio: audioUrl,
      }),
    });
    dispatch({ type: 'LOADING', payload: true });
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
    <div className="flex flex-row justify-center items-center h-screen">
      <Card className="bg-foreground border-none text-white rounded-sm px-4 w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl uppercase">
            Add Song
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="mb-4">
            <label htmlFor="title">
              <span>Title</span>
              <input
                type="text"
                className="bg-foreground w-full text-white border border-white px-3 py-2 rounded-sm"
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
          </CardContent>
          <CardContent className="mb-4">
            <label htmlFor="title">
              <span>Artist</span>
              <input
                type="text"
                className="bg-foreground w-full text-white border border-white px-3 py-2 rounded-sm"
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
          </CardContent>
          <CardContent className="mb-4">
            <label htmlFor="thumbnail">
              <span>Thumbnail</span>
              <input
                type="file"
                className="bg-foreground w-full text-white border border-white px-3 py-2 rounded-sm"
                id="thumbnail"
                name="thumbnail"
                accept=".jpg,.jpeg"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files?.[0]) {
                    dispatch({ type: 'THUMBNAIL', payload: e.target.files[0] });
                  }
                }}
              />
            </label>
          </CardContent>
          <CardContent className="mb-4">
            <label htmlFor="song">
              <span>Song</span>
              <input
                type="file"
                className="bg-foreground w-full text-white border border-white px-3 py-2 rounded-sm"
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
          </CardContent>
          <CardFooter>
            <button
              type="submit"
              className="bg-black w-full rounded-sm cursor-pointer px-3 py-2 hover:opacity-85 disabled:cursor-default disabled:opacity-50"
              disabled={state.loading}
            >
              {state.loading ? "Saving..." : "Submit"}
            </button>
          </CardFooter>
        </form>
        <div className="flex justify-between items-center px-6">
          <span className="text-green-500 -rotate-6">BEATWAVE</span>
          <div className="flex flex-row items-center">
            <ArrowLeft size={20} />
            <Link href="/" className="hover:underline">
              Back
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Song;