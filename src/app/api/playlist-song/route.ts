import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  const playlistsSong = await prisma.playlistSong.findMany({});

  return NextResponse.json({ playlistsSong })
};

export const POST = async (req: NextRequest) => {
  const { song_id, playlist_id } = await req.json();

  const playlistSongs = await prisma.playlistSong.createMany({
    data: song_id.map((id: number) => ({
      song_id: id,
      playlist_id,
    })),
  });

  return NextResponse.json({ playlistSongs });
};
