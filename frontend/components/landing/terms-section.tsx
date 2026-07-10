import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, BookCheck, Clock, ShieldAlert } from "lucide-react";

export function TermsSection() {
  return (
    <section
      className="bg-background border-border/40 relative overflow-hidden border-t py-24"
      id="terms"
    >
      <div className="bg-primary/5 pointer-events-none absolute top-0 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl" />
      <div className="container mx-auto max-w-4xl px-6 md:px-12">
        <div className="mb-16 text-center">
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            Syarat & <span className="text-primary">Ketentuan</span>
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
            Aturan dan kebijakan layanan sirkulasi perpustakaan untuk menjaga
            ketertiban dan kenyamanan bersama.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-card/60 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <BookCheck className="text-primary h-6 w-6" />
                Ketentuan Peminjaman
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Setiap anggota (siswa/guru) hanya diperbolehkan meminjam
                  maksimal <strong>3 buku</strong> secara bersamaan.
                </li>
                <li>
                  Masa pinjam standar untuk setiap buku adalah{" "}
                  <strong>7 hari</strong>.
                </li>
                <li>
                  Peminjaman dilakukan secara mandiri melalui sistem dan harus
                  mendapat persetujuan (approval) dari petugas perpustakaan.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/60 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Clock className="text-primary h-6 w-6" />
                Keterlambatan & Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Keterlambatan pengembalian buku akan memunculkan notifikasi
                  peringatan di dashboard anggota dan petugas perpustakaan.
                </li>
                <li>
                  Anggota yang memiliki buku yang terlambat dikembalikan{" "}
                  <strong>tidak dapat melakukan peminjaman baru</strong> sampai
                  buku tersebut dikembalikan.
                </li>
                <li>
                  Segera kembalikan buku tepat waktu untuk menghindari
                  pembatasan akses peminjaman.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/60 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <ShieldAlert className="text-primary h-6 w-6" />
                Kondisi & Kerusakan Buku
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Buku harus dikembalikan dalam kondisi yang sama saat dipinjam
                  (Bagus).
                </li>
                <li>
                  Jika buku dikembalikan dalam kondisi <strong>Rusak</strong>{" "}
                  atau <strong>Hilang</strong>, maka anggota wajib memberikan
                  keterangan/catatan, dan dapat dikenakan sanksi penggantian
                  sesuai kebijakan sekolah.
                </li>
                <li>
                  Validasi kondisi buku dilakukan oleh petugas saat anggota
                  mengembalikan buku secara fisik ke perpustakaan.
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="bg-muted/60 border-border/40 text-muted-foreground flex items-start gap-3 rounded-xl border p-4 text-sm leading-normal">
            <AlertCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" />
            <span>
              Syarat dan ketentuan ini dibuat agar seluruh anggota dapat
              memanfaatkan fasilitas perpustakaan dengan adil dan bertanggung
              jawab. Kebijakan ini dapat diubah sewaktu-waktu oleh pihak
              sekolah.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
