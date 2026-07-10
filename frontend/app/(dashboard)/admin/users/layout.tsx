import { Fragment, ReactNode } from "react";

export default function AdminUsersLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Fragment>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Manajemen Pengguna
        </h1>
        <p className="mt-2 text-muted-foreground">
          Kelola data admin dan anggota perpustakaan, tambah manual, atau
          unggah massal via Excel.
        </p>
      </div>
      {children}
    </Fragment>
  );
}
