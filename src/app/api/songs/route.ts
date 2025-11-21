import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  const songs = await prisma.song.findMany({});

  return NextResponse.json({ songs });
};

export const POST = async (req: NextRequest) => {
  const { title, artist, audioUrl, audioKey } = await req.json();

  const song = await prisma.song.create({
    data: {
      title,
      artist,
      audioUrl,
      audioKey
    },
  });

  return NextResponse.json({ song });
};

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json();

  const song = await prisma.song.delete({
    where: {
      id
    },
  });

  return NextResponse.json({ song });
};