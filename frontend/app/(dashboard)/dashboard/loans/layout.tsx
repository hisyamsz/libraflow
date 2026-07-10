import { Fragment, ReactNode } from "react";

export default function MemberLoansLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Fragment>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Peminjaman Saya</h1>
        <p className="mt-2 text-muted-foreground">
          Daftar riwayat dan status peminjaman buku Anda.
        </p>
      </div>
      {children}
    </Fragment>
  );
}
