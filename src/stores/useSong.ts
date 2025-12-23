import { Song } from "@prisma/client";
import { create } from "zustand";

interface SongState {
  selectSong: Song | null;
  playing: boolean;

  setSelectSong: (song: Song | null) => void;
  togglePlaying: () => void;
}

const useSong = create<SongState>((set) => ({
  selectSong: null,
  playing: true,

  setSelectSong: (song) => set({ selectSong: song }),
  togglePlaying: () => set((state) => ({ playing: !state.playing })),
}));

export default useSong;