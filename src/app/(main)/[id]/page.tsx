import type { Metadata } from "next";
import { PrismaClient } from "@prisma/client";
import PlaylistClient from "./PlaylistClient";

const prisma = new PrismaClient();

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const playlist = await prisma.playlist.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      name: true,
    },
  });

  return {
    title: playlist?.name ?? "Playlist",
  };
}

export default async function Page({ params }: PageProps) {
  await params;
  return <PlaylistClient />;
}
