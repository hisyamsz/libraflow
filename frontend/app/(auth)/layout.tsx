import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { LibraryBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-muted relative min-h-svh">
      <div className="absolute top-4 right-4 z-10">
        <DarkModeToggle />
      </div>
      <div className="grid min-h-svh grid-cols-1 md:grid-cols-2">
        <div className="p-4 md:p-6">
          <div className="relative h-50 w-full overflow-hidden rounded-2xl shadow-lg md:h-full">
            <Image
              src="/library-compressed.jpg"
              alt="Library"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />

            <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />

            <div className="absolute right-4 bottom-4 left-4 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary p-2 text-primary-foreground shadow-sm">
                  <LibraryBig className="h-5 w-5" />
                </div>
                <Link href="/" className="hover:opacity-85">
                  <h2 className="text-lg font-semibold drop-shadow-sm md:text-2xl">
                    PerpusDigital
                  </h2>
                  <p className="text-xs text-white/80 drop-shadow-sm md:text-sm">
                    Manage your books efficiently
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-4 md:p-10 md:pt-10">
          <div className="w-full max-w-md space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
