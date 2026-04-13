import { Song } from "@prisma/client";

export type SongsResponse = {
  songs: Song[];
};

export async function getSongs(url: string): Promise<SongsResponse> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch songs");
  }

  return res.json();
}
