import { Users, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden py-24 bg-muted/10 border-t border-border/40" id="about">
      <div className="bg-primary/5 pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl" />
      <div className="container mx-auto max-w-4xl px-6 md:px-12">
        <div className="mb-16 text-center">
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tentang <span className="text-primary">Kami</span>
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
            Perpustakaan Digital LibraFlow hadir untuk mendukung
            kegiatan literasi dan pembelajaran siswa secara modern, mudah,
            dan terintegrasi.
          </p>
        </div>

        <div className="space-y-12">
          <div className="prose prose-gray dark:prose-invert max-w-none text-center sm:text-left">
            <p className="text-muted-foreground text-lg">
              Sistem Perpustakaan Digital ini dikembangkan dengan tujuan
              utama mempermudah akses siswa dan guru terhadap koleksi bahan
              pustaka. Dengan antarmuka yang ramah pengguna, proses
              pencarian, peminjaman, dan pengembalian buku dapat dilakukan
              secara real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="bg-card/60 border-border/50">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="bg-primary/10 text-primary rounded-full p-4">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Visi</h3>
                <p className="text-muted-foreground text-sm">
                  Menjadi pusat sumber belajar digital yang unggul dalam
                  mewujudkan siswa yang literat, berwawasan luas, dan
                  berakhlak mulia.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 border-border/50">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="bg-primary/10 text-primary rounded-full p-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Misi</h3>
                <p className="text-muted-foreground text-sm">
                  Menyediakan layanan informasi digital yang cepat, akurat,
                  dan mudah diakses oleh seluruh pengguna LibraFlow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
