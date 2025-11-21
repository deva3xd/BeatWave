"use client";

import React, { useEffect, useReducer, useRef } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Song } from "@prisma/client";
import SongLibrary from "@/components/SongLibrary";
import Player from "@/components/Player";

type StateSong = {
  selectSong: Song | null;
  playing: boolean;
  volume: number;
  currentTime: number;
  duration: number;
};

type ActionSong =
  | { type: "SELECT_SONG"; payload: Song | null }
  | { type: "PLAYING" }
  | { type: "VOLUME"; payload: number }
  | { type: "CURRENT_TIME"; payload: number }
  | { type: "DURATION"; payload: number };

const reducer = (state: StateSong, action: ActionSong) => {
  switch (action.type) {
    case "SELECT_SONG":
      return { ...state, selectSong: action.payload };
    case "PLAYING":
      return { ...state, playing: !state.playing };
    case "VOLUME":
      return { ...state, volume: action.payload };
    case "CURRENT_TIME":
      return { ...state, currentTime: action.payload };
    case "DURATION":
      return { ...state, duration: action.payload };
    default:
      throw new Error("unexpected action");
  }
};

const initialState = {
  selectSong: null,
  playing: true,
  volume: 1,
  currentTime: 0,
  duration: 0,
};

const Home = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (audioRef.current && state.selectSong) {
      audioRef.current.play();
      dispatch({ type: "PLAYING" });
    }
  }, [state.selectSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () =>
      dispatch({ type: "CURRENT_TIME", payload: audio.currentTime });
    const setAudioData = () =>
      dispatch({ type: "DURATION", payload: audio.duration });

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioData);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioData);
    };
  }, [state.selectSong]);

  // progress bar
  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      dispatch({ type: "CURRENT_TIME", payload: value });
    }
  };

  // controll audio
  const handleAudio = () => {
    if (!audioRef.current) return;

    if (state.playing) {
      audioRef.current.pause();
      dispatch({ type: "PLAYING" });
    } else {
      audioRef.current.play();
      dispatch({ type: "PLAYING" });
    }
  };

  // selected song
  const handleClick = (song: Song) => {
    if (!audioRef.current) return;

    if (state.selectSong?.id === song.id) {
      handleAudio();
    } else {
      dispatch({ type: "SELECT_SONG", payload: song });
      dispatch({ type: "PLAYING" });
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
    dispatch({ type: "VOLUME", payload: value });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-screen mx-auto bg-background">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-white bg-black hover:text-white/50 hover:bg-transparent cursor-pointer" />
            <span className="font-semibold text-sm text-white">Song List</span>
          </div>
          <div className="text-white bg-foreground">
            <SongLibrary
              songState={{
                value: state.selectSong,
                set: (song) => dispatch({ type: "SELECT_SONG", payload: song }),
              }}
              isPlaying={state.playing}
              handleClick={handleClick}
            />
          </div>
          <div
            className={`fixed bottom-0 right-0 text-white bg-background p-4 w-full z-50 ${state.selectSong ? "grid grid-cols-3" : "hidden"
              }`}
          >
            <Player
              selectSong={state.selectSong}
              handleAudio={handleAudio}
              isPlaying={state.playing}
              duration={state.duration}
              currentTime={state.currentTime}
              handleSeek={handleSeek}
              handleVolume={handleVolume}
              volume={state.volume}
            />
          </div>
        </div>
      </main>
      <audio ref={audioRef} src={state.selectSong?.audioUrl} />
    </SidebarProvider>
  );
};

export default Home;
