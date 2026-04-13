import { Playlist } from "@prisma/client";

export type PlaylistsResponse = {
  playlists: Playlist[];
};

export async function getPlaylists(url: string): Promise<PlaylistsResponse> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch playlists");
  }

  return res.json();
}
