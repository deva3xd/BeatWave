import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const playlistSong = await prisma.playlistSong.findMany({
    where: {
      playlist_id: Number(params.id),
    },
    include: {
      playlist: true,
      song: true,
    }
  });
  
  return NextResponse.json({ playlistSong })
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
