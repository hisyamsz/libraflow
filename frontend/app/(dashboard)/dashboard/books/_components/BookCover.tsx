"use client";

import { useState } from "react";
import Image from "next/image";
import { BookCopy } from "lucide-react";
import { getGoogleDriveDirectLink } from "@/lib/utils";

interface BookCoverProps {
  src?: string | null;
  title: string;
}

export default function BookCover({ src, title }: BookCoverProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="bg-muted text-muted-foreground flex h-52 w-full items-center justify-center rounded-t-lg sm:h-60">
        <BookCopy size={48} />
      </div>
    );
  }

  const directSrc = getGoogleDriveDirectLink(src);

  return (
    <div className="relative h-52 w-full sm:h-60">
      <Image
        src={directSrc}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
        className="rounded-t-lg object-cover"
        onError={() => setError(true)}
        priority
      />
    </div>
  );
}
