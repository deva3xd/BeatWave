import { create } from "zustand";

interface AudioState {
  volume: number;
  currentTime: number;
  duration: number;

  setVolume: (volume: number) => void;
  setCurrentTime: (currentTime: number) => void;
  setDuration: (duration: number) => void;
}

const useAudio = create<AudioState>((set) => ({
  volume: 1,
  currentTime: 0,
  duration: 0,

  setVolume: (volume) => set({ volume }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
}));

export default useAudio;