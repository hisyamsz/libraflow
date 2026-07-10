import { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Pengaturan Akun | Library System",
  description: "Kelola data profil Anda dan perbarui setelan keamanan akun.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Akun</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Kelola data profil Anda dan perbarui setelan keamanan akun.
        </p>
      </div>

      {children}
    </Fragment>
  );
}
