"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-key.constants";
import dashboardService from "@/services/dashboard.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Book,
  Layers,
  Users,
  BookOpen,
  Clock,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import StatCard from "@/components/common/stat-card";

const COLORS = {
  active: "#10b981", // Emerald
  pending: "#f59e0b", // Amber
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border-border/80 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md">
        <p className="text-foreground text-sm font-semibold">
          {payload[0].name}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Jumlah:{" "}
          <span className="font-bold" style={{ color: payload[0].color }}>
            {payload[0].value} Buku
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_STATS],
    queryFn: async () => {
      const res = await dashboardService.getAdminStats();
      return res.data.data;
    },
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const chartData = data
    ? [
        {
          name: "Peminjaman Aktif",
          value: data.totalActiveLoans,
          color: COLORS.active,
        },
        {
          name: "Peminjaman Pending",
          value: data.totalPendingLoans,
          color: COLORS.pending,
        },
      ]
    : [];

  const hasChartData = data
    ? data.totalActiveLoans > 0 || data.totalPendingLoans > 0
    : false;

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-start justify-between sm:block sm:w-auto">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Admin
            </h1>
            <p className="text-muted-foreground mt-2 hidden text-sm sm:block">
              Statistik perpustakaan, peminjaman aktif, pending, dan
              keterlambatan.
            </p>
          </div>
          {/* Refresh Button on Mobile */}
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            className="hover:bg-accent hover:text-accent-foreground cursor-pointer shadow-xs sm:hidden"
            disabled={mounted ? isRefetching || isLoading : false}
            title="Segarkan Data"
          >
            <RefreshCw
              className={
                mounted && (isRefetching || isLoading)
                  ? "h-4 w-4 animate-spin"
                  : "h-4 w-4"
              }
            />
          </Button>
        </div>

        {/* Description for Mobile */}
        <p className="text-muted-foreground text-sm sm:hidden">
          Statistik perpustakaan, peminjaman aktif, pending, dan keterlambatan.
        </p>

        {/* Refresh Button on Desktop */}
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="icon"
          className="hover:bg-accent hover:text-accent-foreground hidden cursor-pointer shadow-xs sm:flex"
          disabled={mounted ? isRefetching || isLoading : false}
          title="Segarkan Data"
        >
          <RefreshCw
            className={
              mounted && (isRefetching || isLoading)
                ? "h-4 w-4 animate-spin"
                : "h-4 w-4"
            }
          />
        </Button>
      </div>

      {isLoading || isRefetching ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Skeleton className="h-[350px] rounded-xl lg:col-span-1" />
            <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
          </div>
        </div>
      ) : isError || !data ? (
        <div className="border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center space-y-4 rounded-xl border p-8 text-center">
          <AlertTriangle className="text-destructive h-12 w-12" />
          <h3 className="text-destructive text-lg font-semibold">
            Gagal Memuat Statistik
          </h3>
          <p className="text-muted-foreground max-w-md text-sm">
            Terjadi kesalahan saat berkomunikasi dengan server perpustakaan.
          </p>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>
        </div>
      ) : (
        <div className="animate-in fade-in space-y-6 duration-500">
          {/* Grid Cards */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            <StatCard
              title="Total Buku"
              value={data.totalBooks}
              icon={<Book className="h-4 w-4 text-blue-500" />}
            />
            <StatCard
              title="Kategori"
              value={data.totalCategories}
              icon={<Layers className="h-4 w-4 text-purple-500" />}
            />
            <StatCard
              title="Total Anggota"
              value={data.totalMembers}
              icon={<Users className="h-4 w-4 text-green-500" />}
            />
            <StatCard
              title="Buku Dipinjam"
              value={data.totalActiveLoans}
              icon={<BookOpen className="h-4 w-4 text-emerald-500" />}
            />
            <StatCard
              title="Pending"
              value={data.totalPendingLoans}
              icon={<Clock className="h-4 w-4 text-amber-500" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Chart */}
            <Card className="bg-card/75 dark:bg-card/45 shadow-xs backdrop-blur-md lg:col-span-1 dark:border-white/5">
              <CardHeader>
                <CardTitle>Distribusi Peminjaman</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[300px] w-full items-center justify-center">
                  {hasChartData ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{
                            fontSize: "12px",
                            paddingTop: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center gap-2 text-center">
                      <div className="border-muted h-32 w-32 rounded-full border-8" />
                      <p className="mt-4 text-sm">Belum ada data peminjaman</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Overdue Loans Table */}
            <Card className="bg-card/75 dark:bg-card/45 shadow-xs backdrop-blur-md lg:col-span-2 dark:border-white/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Peringatan Keterlambatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.overdueLoans.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center">
                    Tidak ada peminjaman yang terlambat.
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Peminjam</TableHead>
                          <TableHead>Judul Buku</TableHead>
                          <TableHead>Jatuh Tempo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.overdueLoans.map((loan) => (
                          <TableRow key={loan.id}>
                            <TableCell>
                              <div className="font-medium">
                                {loan.user.name}
                              </div>
                              {loan.user.nis && (
                                <div className="text-muted-foreground text-xs">
                                  NIS: {loan.user.nis}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{loan.book.title}</TableCell>
                            <TableCell className="text-destructive font-semibold">
                              {formatDate(loan.dueDate)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
