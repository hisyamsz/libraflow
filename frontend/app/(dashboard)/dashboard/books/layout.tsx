import { Fragment, ReactNode } from "react";

export default function DashboardBooksLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Fragment>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Katalog Buku</h1>
        <p className="mt-2 text-muted-foreground">
          Temukan dan pinjam buku yang tersedia di perpustakaan.
        </p>
      </div>
      {children}
    </Fragment>
  );
}
