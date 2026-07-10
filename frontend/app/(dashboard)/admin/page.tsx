import AdminDashboard from "./_components/AdminDashboard";

export const metadata = {
  title: "Dashboard Admin",
  description: "Statistik perpustakaan, peminjaman aktif, pending, dan keterlambatan",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
