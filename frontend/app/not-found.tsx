import type { Metadata } from "next";
import Link from "next/link";
import { Home, BookOpen, Search, LayoutDashboard, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Navbar } from "@/components/common/navbar";
import { BackButton } from "@/components/common/back-button";
import { Footer } from "@/components/common/footer";

export const metadata: Metadata = {
  title: "404 – Halaman Tidak Ditemukan | PerpusDigital",
  description:
    "Halaman yang Anda cari tidak ditemukan. Kembali ke beranda atau jelajahi fitur perpustakaan digital kami.",
};

const quickLinks = [
  { href: "/login", label: "Masuk / Login", icon: User },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/loans", label: "Riwayat Peminjaman", icon: FileText },
  { href: "/dashboard/books", label: "Katalog Buku", icon: BookOpen },
];

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content — pt-16 agar pas di bawah sticky navbar h-16 */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        {/* Background Decorative Orbs */}
        <div className="bg-primary/8 pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl" />
        <div className="bg-destructive/5 pointer-events-none absolute right-1/4 bottom-0 -z-10 h-[300px] w-[300px] rounded-full blur-3xl" />

        <div className="container mx-auto w-full max-w-2xl text-center">
          {/* 404 Badge */}
          <Badge
            variant="secondary"
            className="text-destructive bg-destructive/10 border-destructive/20 animate-fade-in mb-5 inline-flex px-3.5 py-1.5 text-xs font-semibold tracking-wide"
          >
            Error 404
          </Badge>

          {/* Animated 404 Number with Icon Overlay */}
          <div className="animate-fade-in-up relative mb-4 select-none">
            <p className="from-primary/25 to-primary/5 bg-linear-to-b bg-clip-text text-[110px] leading-none font-extrabold text-transparent sm:text-[150px] md:text-[180px]">
              404
            </p>
            {/* Floating Book Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary/10 border-primary/20 animate-bounce rounded-full border p-4 shadow-lg backdrop-blur-sm">
                <BookOpen className="text-primary h-9 w-9 sm:h-11 sm:w-11" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-foreground animate-fade-in-up text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
            Halaman Tidak Ditemukan
          </h1>

          {/* Description */}
          <p className="text-muted-foreground animate-fade-in-up animate-delay-100 mx-auto mt-3 max-w-md text-sm leading-relaxed sm:text-base">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman
            telah dipindahkan, dihapus, atau URL yang dimasukkan salah.
          </p>

          {/* Primary CTA Buttons */}
          <div className="animate-fade-in-up animate-delay-200 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              id="btn-back-home"
              size="lg"
              className="shadow-primary/20 w-full gap-2 font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-95 sm:w-auto"
              asChild
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </Button>

            <Button
              id="btn-browse-books"
              size="lg"
              variant="outline"
              className="hover:bg-muted/50 w-full gap-2 font-semibold transition-all hover:scale-[1.02] active:scale-95 sm:w-auto"
              asChild
            >
              <Link href="/dashboard/books">
                <Search className="h-4 w-4" />
                Cari Koleksi Buku
              </Link>
            </Button>
          </div>

          {/* Quick Links Card */}
          <Card className="animate-fade-in-up animate-delay-300 mt-10 text-left">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-sm font-semibold">
                Halaman yang sering dikunjungi
              </CardTitle>
              <CardDescription className="text-xs">
                Temukan apa yang Anda cari di salah satu halaman berikut.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {quickLinks.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      id={`quick-link-${idx}`}
                      className="hover:bg-muted/60 border-border/50 text-foreground group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all hover:scale-[1.01] active:scale-95"
                    >
                      <span className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors group-hover:bg-primary/15">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <BackButton />
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
