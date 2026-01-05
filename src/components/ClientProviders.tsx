"use client";

export default function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}