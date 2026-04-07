import type { Metadata } from "next";
import PlaylistClient from "./PlaylistClient";

export const metadata: Metadata = {
    title: "Playlist",
};

export default function Page() {
  return <PlaylistClient />;
}