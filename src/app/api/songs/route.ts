import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  const songs = await prisma.song.findMany({});

  return NextResponse.json({ songs });
};

export const POST = async (req: NextRequest) => {
  const { title, artist, audio } = await req.json();

  const song = await prisma.song.create({
    data: {
      title,
      artist,
      audio, 
    },
  });

  return NextResponse.json({ song });
};
