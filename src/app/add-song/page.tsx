import type { Metadata } from "next";
import AddSongClient from "./AddSongClient";

export const metadata: Metadata = {
  title: "Add Song",
};

export default function Page() {
  return <AddSongClient />;
}