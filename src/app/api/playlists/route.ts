import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
  const playlists = await prisma.playlist.findMany({});

  return NextResponse.json({
    playlists: playlists.map(p => ({
      ...p,
      year: new Date(p.createdAt).getFullYear(),
    }))
  });
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
