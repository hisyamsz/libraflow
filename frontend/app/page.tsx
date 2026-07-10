import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { FeaturesSection } from "@/components/landing/features-section";
import { AboutSection } from "@/components/landing/about-section";
import { TermsSection } from "@/components/landing/terms-section";

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col overflow-x-hidden">
      {/* Navbar Publik */}
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-24 md:py-36">
          {/* Background Decorative Orbs */}
          <div className="bg-primary/10 dark:bg-primary/5 pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

          <div className="container mx-auto max-w-7xl px-6 md:px-12">
            <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
              {/* Copywriting & CTA */}
              <div className="flex flex-col items-start text-left">
                <Badge
                  variant="secondary"
                  className="text-primary bg-primary/10 border-primary/20 animate-fade-in mb-6 px-3.5 py-1.5 text-xs font-semibold tracking-wide"
                >
                  Sistem Perpustakaan Digital Modern
                </Badge>

                <h1 className="text-foreground animate-fade-in-up text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  Perpustakaan Digital <br />
                  <span className="from-primary to-primary/80 bg-linear-to-r bg-clip-text text-transparent">
                    LibraFlow
                  </span>
                </h1>

                <p className="text-muted-foreground animate-fade-in-up animate-delay-200 mt-6 max-w-xl text-lg leading-relaxed sm:text-xl">
                  Cari katalog buku secara real-time, ajukan peminjaman mandiri,
                  dan pantau status jatuh tempo serta riwayat sirkulasi yang
                  tertib dan transparan.
                </p>

                <div className="animate-fade-in-up animate-delay-300 mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="shadow-primary/20 w-full font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-95 sm:w-auto"
                    >
                      Mulai Jelajahi
                    </Button>
                  </Link>
                  <a href="#keunggulan" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="hover:bg-muted/50 w-full font-semibold transition-all sm:w-auto"
                    >
                      Lihat Fitur Sistem
                    </Button>
                  </a>
                </div>
              </div>

              {/* Visual Decorative Hero Illustration - Realistic App Dashboard Mockup */}
              <div className="animate-fade-in animate-delay-200 relative flex items-center justify-center select-none">
                <div className="bg-primary/20 dark:bg-primary/10 pointer-events-none absolute h-80 w-80 animate-pulse rounded-full opacity-70 blur-3xl filter" />

                {/* Mockup Student Dashboard */}
                <div className="from-card to-muted border-border/80 group relative flex w-full max-w-[440px] flex-col gap-5 overflow-hidden rounded-2xl border bg-linear-to-br p-6 shadow-2xl">
                  {/* Decorative card gradient shine */}
                  <div className="via-primary/5 absolute inset-0 -translate-x-full bg-linear-to-tr from-transparent to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                  {/* Header Mockup */}
                  <div className="border-border/40 flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-primary bg-primary/5 border-primary/20 font-mono text-[10px] md:text-xs"
                    >
                      Sesi Anggota Aktif
                    </Badge>
                  </div>

                  {/* Stats Summary Mockup */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/50 border-border/45 rounded-xl border p-3">
                      <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                        Peminjaman Aktif
                      </p>
                      <p className="text-foreground mt-1 text-xl font-bold md:text-2xl">
                        2{" "}
                        <span className="text-muted-foreground text-xs font-normal">
                          / 3 Buku
                        </span>
                      </p>
                    </div>
                    <div className="bg-background/50 border-border/45 rounded-xl border p-3">
                      <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                        Buku Terlambat
                      </p>
                      <p className="mt-1 text-xl font-bold text-green-600 dark:text-green-400 md:text-2xl">
                        0
                      </p>
                    </div>
                  </div>

                  {/* Active Borrowing Item Mockup */}
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      Sedang Dipinjam
                    </p>

                    <div className="bg-primary/5 border-primary/10 flex items-start gap-3 rounded-xl border p-3">
                      <div className="bg-primary/20 text-primary flex h-10 w-8 shrink-0 items-center justify-center rounded text-[10px] font-bold shadow-inner">
                        BUKU
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-xs font-bold">
                          Laskar Pelangi
                        </p>
                        <p className="text-muted-foreground truncate text-[10px]">
                          Andrea Hirata • Novel
                        </p>
                      </div>
                      <Badge className="border-amber-500/20 bg-amber-500/10 dark:bg-amber-500/15 text-[10px] text-amber-600 dark:text-amber-400 shadow-none">
                        Sisa 3 Hari
                      </Badge>
                    </div>
                  </div>

                  {/* Info Rules Warning Alert Mockup */}
                  <div className="bg-muted/60 border-border/40 text-muted-foreground flex items-start gap-2.5 rounded-xl border p-3 text-[11px] leading-normal">
                    <AlertCircle className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Kembalikan tepat waktu untuk menghindari pembatasan
                      peminjaman baru.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES / KEUNGGULAN SECTION */}
        <FeaturesSection />

        {/* ABOUT SECTION */}
        <AboutSection />

        {/* TERMS SECTION */}
        <TermsSection />
      </main>

      {/* FOOTER SECTION */}
      <Footer />
    </div>
  );
}
