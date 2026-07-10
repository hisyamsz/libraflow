import MemberDashboard from "./_components/MemberDashboard";

export const metadata = {
  title: "Dashboard",
  description: "Statistik peminjaman buku personal dan status denda anda",
};

export default function DashboardPage() {
  return <MemberDashboard />;
}
