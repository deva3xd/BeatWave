"use client";

import React, { useEffect, useRef } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Song } from "@prisma/client";
import SongLibrary from "@/components/SongLibrary";
import Player from "@/components/Player";
import useSong from "@/stores/useSong";
import useAudio from "@/stores/useAudio";

const Home = () => {
  const { selectSong, playing, setSelectSong, togglePlaying } = useSong();
  const { volume, duration, currentTime, setVolume, setDuration, setCurrentTime } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);

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
  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  // controll audio
  const handleAudio = () => {
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
  const handleClick = (song: Song) => {
    if (!audioRef.current) return;

    if (selectSong?.id === song.id) {
      handleAudio();
    } else {
      setSelectSong(song);
      togglePlaying;
      setTimeout(() => {
        audioRef.current?.play();
      }, 0);
    }
  };

  // volume
  const handleVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
    setVolume(value);
  };

  return (
    <>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-white bg-black hover:text-white/50 hover:bg-transparent cursor-pointer" />
          <span className="font-semibold text-sm text-white">Song List</span>
        </div>
        <div className="text-white bg-foreground">
          <SongLibrary
            songState={{
              value: selectSong,
              set: (song) => setSelectSong(song),
            }}
            isPlaying={playing}
            handleClick={handleClick}
          />
        </div>
        <div
          className={`fixed bottom-0 right-0 text-white bg-background p-4 w-full z-50 ${selectSong ? "grid grid-cols-3" : "hidden"}`}
        >
          <Player
            selectSong={selectSong}
            handleAudio={handleAudio}
            isPlaying={playing}
            duration={duration}
            currentTime={currentTime}
            handleSeek={handleSeek}
            handleVolume={handleVolume}
            volume={volume}
          />
        </div>
      </div>
      <audio ref={audioRef} src={selectSong?.audioUrl} />
    </>
  );
};

export default Home;
