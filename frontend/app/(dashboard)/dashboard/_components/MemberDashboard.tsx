"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import dashboardService from "@/services/dashboard.service";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/constants/query-key.constants";
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  AlertCircle,
  BookDown,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, cn } from "@/lib/utils";
import StatCard from "@/components/common/stat-card";

export default function MemberDashboard() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: [QUERY_KEYS.MEMBER_STATS],
    queryFn: async () => {
      const res = await dashboardService.getMemberStats();
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



  const hasOverdueLoans = data ? data.overdueLoans.length > 0 : false;
  const hasDamaged = data ? data.damagedReturns > 0 : false;
  const hasLost = data ? data.lostReturns > 0 : false;

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-start justify-between sm:block sm:w-auto">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-sm hidden sm:block">
              Pantau status peminjaman, buku yang dipinjam, keterlambatan, dan
              denda Anda.
            </p>
          </div>
          {/* Refresh Button on Mobile */}
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            className="hover:bg-accent hover:text-accent-foreground cursor-pointer shadow-xs sm:hidden"
            disabled={mounted ? (isRefetching || isLoading) : false}
            title="Segarkan Data"
          >
            <RefreshCw
              className={mounted && (isRefetching || isLoading) ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
          </Button>
        </div>

        {/* Description for Mobile */}
        <p className="text-muted-foreground text-sm sm:hidden">
          Pantau status peminjaman, buku yang dipinjam, keterlambatan, dan
          denda Anda.
        </p>

        {/* Refresh Button on Desktop */}
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="icon"
          className="hover:bg-accent hover:text-accent-foreground cursor-pointer hidden sm:flex shadow-xs"
          disabled={mounted ? (isRefetching || isLoading) : false}
          title="Segarkan Data"
        >
          <RefreshCw
            className={mounted && (isRefetching || isLoading) ? "h-4 w-4 animate-spin" : "h-4 w-4"}
          />
        </Button>
      </div>

      {isLoading || isRefetching ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
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
        <div className="animate-in fade-in duration-500 space-y-6">
          {/* Overdue Alert Box */}
          {hasOverdueLoans && (
            <div className="border-destructive/20 bg-destructive/10 dark:bg-destructive/5 text-destructive rounded-xl border p-4 backdrop-blur-md dark:text-red-400">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                <h3 className="text-sm font-semibold sm:text-base md:text-lg">
                  PERINGATAN: Anda memiliki {data.overdueLoans.length} buku yang
                  terlambat dikembalikan!
                </h3>
              </div>
              <ul className="ml-2 list-inside list-disc space-y-1 text-xs sm:text-sm md:text-base">
                {data.overdueLoans.map((loan) => (
                  <li key={loan.id} className="leading-relaxed">
                    <span className="font-medium">{loan.book.title}</span> (Jatuh
                    tempo:{" "}
                    <span className="font-semibold underline">
                      {formatDate(loan.dueDate)}
                    </span>
                    )
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Grid Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <StatCard
              title="Peminjaman Aktif"
              value={data.activeLoans}
              icon={<BookOpen className="h-4 w-4 text-emerald-500" />}
            />
            <StatCard
              title="Peminjaman Pending"
              value={data.pendingLoans}
              icon={<Clock className="h-4 w-4 text-amber-500" />}
            />
            <StatCard
              title="Pengembalian Sukses"
              value={data.returnedLoans}
              icon={<CheckCircle className="h-4 w-4 text-emerald-500" />}
            />
            <StatCard
              title="Buku Rusak"
              value={data.damagedReturns}
              icon={
                <BookDown
                  className={cn(
                    "h-4 w-4",
                    hasDamaged ? "text-amber-500" : "text-muted-foreground/60",
                  )}
                />
              }
              className={
                hasDamaged
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:bg-amber-500/5 dark:text-amber-300"
                  : ""
              }
              valueClassName={
                hasDamaged
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
              }
              description={
                hasDamaged
                  ? "Ada buku dikembalikan dalam kondisi rusak."
                  : "Rekam jejak bersih dari buku rusak."
              }
            />
            <StatCard
              title="Buku Hilang"
              value={data.lostReturns}
              icon={
                <XCircle
                  className={cn(
                    "h-4 w-4",
                    hasLost ? "text-destructive" : "text-muted-foreground/60",
                  )}
                />
              }
              className={
                hasLost
                  ? "border-destructive/20 bg-destructive/10 dark:bg-destructive/5 text-destructive"
                  : ""
              }
              valueClassName={
                hasLost ? "text-destructive" : "text-muted-foreground"
              }
              description={
                hasLost
                  ? "Ada tanggungan buku yang dinyatakan hilang."
                  : "Rekam jejak bersih dari buku hilang."
              }
            />

          </div>

          <div className="bg-muted/60 border-border/40 text-muted-foreground flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-normal sm:text-sm">
            <AlertCircle className="text-primary mt-0.5 h-4.5 w-4.5 shrink-0" />
            <span>
              Kembalikan tepat waktu untuk menghindari pembatasan
              peminjaman baru.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
