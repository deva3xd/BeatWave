import { useEffect, useRef } from "react";
import { Song } from "@prisma/client";
import useSong from "@/stores/useSong";
import useAudio from "@/stores/useAudio";

export function useAudioPlayer<T extends { id: number }>() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { selectSong, playing, setSelectSong, togglePlaying } = useSong();
  const { volume, currentTime, duration, setVolume, setDuration, setCurrentTime } = useAudio();

  useEffect(() => {
    if (audioRef.current && selectSong) {
      audioRef.current.play();
      togglePlaying();
    }
  }, [selectSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () =>
      setCurrentTime(audio.currentTime);
    const setAudioData = () =>
      setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioData);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioData);
    };
  }, [selectSong]);

  // progress bar
  const seek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  // controll audio
  const audio = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      togglePlaying();
    } else {
      audioRef.current.play();
      togglePlaying();
    }
  };

  // selected song
  const selected = (song: Song) => {
    if (!audioRef.current) return;

    if (selectSong?.id === song.id) {
      audio();
    } else {
      setSelectSong(song);
      togglePlaying;
      setTimeout(() => {
        audioRef.current?.play();
      }, 0);
    }
  };

  // volume
  const toggleVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
    setVolume(value);
  };

  return {
    toggleVolume,
    selected,
    audio,
    seek,
    audioRef,
    volume,
    duration,
    currentTime,
    selectSong,
    playing
  }
}
