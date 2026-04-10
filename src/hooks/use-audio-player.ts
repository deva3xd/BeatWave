"use client";

import { useCallback, useEffect } from "react";
import { Song } from "@prisma/client";
import usePlayer from "@/stores/usePlayer";
import useAudio from "@/stores/useAudio";

export function useAudioPlayer<T extends { id: number }>(options?: { controller?: boolean }) {
  const controller = options?.controller ?? false;
  const {
    selectSong,
    playing,
    audioElement,
    queue,
    setSelectSong,
    setPlaying,
    setAudioElement,
    setQueue,
  } = usePlayer();
  const { volume, currentTime, duration, setVolume, setDuration, setCurrentTime } = useAudio();

  const setAudioRef = useCallback((node: HTMLAudioElement | null) => {
    if (!node) {
      setAudioElement(null);
      return;
    }

    // Keep one shared audio element in the store so every component controls the same player.
    node.volume = volume;
    setAudioElement(node);
  }, [setAudioElement, volume]);

  useEffect(() => {
    if (!controller) return;
    if (!audioElement) return;

    audioElement.volume = volume;
  }, [audioElement, controller, volume]);

  useEffect(() => {
    if (!controller) return;
    if (!audioElement || !selectSong) return;

    // Only the controller instance should start playback for newly selected songs.
    const isNewSource = audioElement.src !== selectSong.audioUrl;

    if (isNewSource) {
      audioElement.src = selectSong.audioUrl;
      audioElement.currentTime = 0;
      setCurrentTime(0);
    }

    const playAudio = async () => {
      try {
        await audioElement.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };

    void playAudio();
  }, [audioElement, controller, selectSong, setCurrentTime, setPlaying]);

  useEffect(() => {
    if (!controller) return;
    const audio = audioElement;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioData = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("durationchange", setAudioData);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("durationchange", setAudioData);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioElement, controller, setCurrentTime, setDuration, setPlaying]);

  useEffect(() => {
    if (!controller) return;
    if (!selectSong) {
      setCurrentTime(0);
      setDuration(0);
      setPlaying(false);
    }
  }, [controller, selectSong, setCurrentTime, setDuration, setPlaying]);

  // progress bar
  const seek = (value: number) => {
    if (audioElement) {
      audioElement.currentTime = value;
      setCurrentTime(value);
    }
  };

  // control playback from the shared <audio> element instead of a component-local ref
  const audio = async () => {
    if (!audioElement || !selectSong) return;

    if (playing) {
      audioElement.pause();
    } else {
      try {
        await audioElement.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  // selecting the same song toggles pause/play
  const selected = (song: Song) => {
    if (selectSong?.id === song.id) {
      void audio();
    } else {
      setSelectSong(song);
    }
  };

  // volume
  const toggleVolume = (value: number) => {
    if (audioElement) {
      audioElement.volume = value;
    }
    setVolume(value);
  };

  const playByIndex = (index: number) => {
    if (!queue.length) return;

    const normalizedIndex = (index + queue.length) % queue.length;
    setSelectSong(queue[normalizedIndex]);
  };

  const playNext = () => {
    if (!selectSong || !queue.length) return;

    const currentIndex = queue.findIndex((song) => song.id === selectSong.id);
    playByIndex(currentIndex === -1 ? 0 : currentIndex + 1);
  };

  const playPrev = () => {
    if (!selectSong || !queue.length) return;

    const currentIndex = queue.findIndex((song) => song.id === selectSong.id);
    playByIndex(currentIndex === -1 ? 0 : currentIndex - 1);
  };

  return {
    setAudioRef,
    setQueue,
    toggleVolume,
    selected,
    audio,
    seek,
    playNext,
    playPrev,
    volume,
    duration,
    currentTime,
    selectSong,
    playing
  }
}
