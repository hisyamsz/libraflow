import { Fragment, ReactNode } from "react";

export default function AdminLoansLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Fragment>
      <div className="mb-8 print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">
          Manajemen Peminjaman
        </h1>
        <p className="mt-2 text-muted-foreground">
          Kelola seluruh pengajuan peminjaman buku dari anggota perpustakaan.
        </p>
      </div>
      {children}
    </Fragment>
  );
}
