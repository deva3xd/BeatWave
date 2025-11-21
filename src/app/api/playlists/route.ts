import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  const playlists = await prisma.playlist.findMany({});

  return NextResponse.json({ playlists })
};

export const POST = async (req: NextRequest) => {
  const { name } = await req.json();

  const playlist = await prisma.playlist.create({
    data: {
      name,
    },
  });

  return NextResponse.json({ playlist });
};

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json();

  const playlist = await prisma.playlist.delete({
    where: {
      id
    },
  });

  return NextResponse.json({ playlist });
};