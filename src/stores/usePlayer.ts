import { Song } from "@prisma/client";
import { create } from "zustand";

interface SongState {
  selectSong: Song | null;
  playing: boolean;
  audioElement: HTMLAudioElement | null;
  queue: Song[];

  setSelectSong: (song: Song | null) => void;
  setPlaying: (playing: boolean) => void;
  setAudioElement: (audioElement: HTMLAudioElement | null) => void;
  setQueue: (queue: Song[]) => void;
}

const usePlayer = create<SongState>((set) => ({
  selectSong: null,
  playing: false,
  audioElement: null,
  queue: [],

  setSelectSong: (song) => set({ selectSong: song }),
  setPlaying: (playing) => set({ playing }),
  setAudioElement: (audioElement) => set({ audioElement }),
  setQueue: (queue) => set({ queue }),
}));

export default usePlayer;
