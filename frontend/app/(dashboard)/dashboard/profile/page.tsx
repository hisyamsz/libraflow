"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabProfile from "./_components/TabProfile";
import TabSecurity from "./_components/TabSecurity";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Spinner className="text-primary h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profil Header tanpa Card */}
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <Avatar className="h-24 w-24 shadow-sm ring-4 ring-indigo-50 transition-all hover:scale-105 dark:ring-indigo-950/50">
          <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-inner">
            {user.name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-foreground text-2xl font-bold tracking-tight">
            {user.name}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-800 shadow-sm ring-1 ring-indigo-500/20 ring-inset dark:bg-indigo-900/40 dark:text-indigo-300">
              {user.role}
            </span>
            {user.nis && (
              <span className="text-muted-foreground bg-muted/60 border-border/60 flex items-center rounded-full border px-3 py-1 text-xs font-medium shadow-sm">
                NIS/NIP: {user.nis}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Penggunaan Komponen Tabs Shadcn UI */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-muted/50 mb-6 grid w-full max-w-[400px] grid-cols-2 rounded-xl p-1">
          <TabsTrigger
            value="profile"
            className="rounded-lg transition-all data-[state=active]:shadow-sm"
          >
            Profil Saya
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg transition-all data-[state=active]:shadow-sm"
          >
            Keamanan Akun
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profil Pengguna (Read-Only) */}
        <TabsContent
          value="profile"
          className="animate-in fade-in duration-200 mt-0"
        >
          <TabProfile />
        </TabsContent>

        {/* Tab 2: Keamanan Akun (Ganti Password Form) */}
        <TabsContent
          value="security"
          className="animate-in fade-in duration-200 mt-0"
        >
          <TabSecurity />
        </TabsContent>
      </Tabs>
    </div>
  );
}
