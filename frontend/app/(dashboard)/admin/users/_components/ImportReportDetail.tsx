"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface ImportReport {
  totalProcessed: number;
  totalCreated: number;
  totalUpdated: number;
  totalSuccess: number;
  totalFailed: number;
  createdUsers?: { name: string; nis: string; class: string | null }[];
  updatedUsers?: { name: string; nis: string; class: string | null }[];
  errors?: string[];
}

interface ImportReportDetailProps {
  report: ImportReport;
  isSuccess: boolean;
}

export default function ImportReportDetail({
  report,
  isSuccess,
}: ImportReportDetailProps) {
  return (
    <div className="animate-in fade-in space-y-4 py-2 duration-200">
      {/* Statistik */}
      {isSuccess && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="bg-secondary/40 rounded-lg border p-3 text-center">
            <p className="text-muted-foreground text-xs">Diproses</p>
            <p className="text-foreground text-2xl font-bold">
              {report.totalProcessed}
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Baru
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {report.totalCreated}
            </p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-800 dark:bg-blue-950/30">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Diperbarui
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {report.totalUpdated}
            </p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center dark:border-red-800 dark:bg-red-950/30">
            <p className="text-xs text-red-600 dark:text-red-400">Gagal</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {report.totalFailed}
            </p>
          </div>
        </div>
      )}

      {/* Badge ringkasan saat sukses penuh */}
      {isSuccess && report.totalFailed === 0 && (
        <Alert className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <AlertTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Semua Data Berhasil Diimport
          </AlertTitle>
          <AlertDescription className="text-xs text-emerald-600 dark:text-emerald-400">
            Total {report.totalProcessed} data berhasil diproses.{" "}
            {report.totalCreated > 0 && (
              <span>{report.totalCreated} pengguna baru ditambahkan. </span>
            )}
            {report.totalUpdated > 0 && (
              <span>{report.totalUpdated} pengguna berhasil diperbarui.</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Detail Hasil Sukses */}
      {isSuccess && (
        <div className="space-y-3">
          {report.createdUsers && report.createdUsers.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Daftar Pengguna Baru ({report.createdUsers.length})
              </p>
              <div className="max-h-[140px] overflow-y-auto rounded-md border border-emerald-100 bg-emerald-50/20 p-2 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/5">
                <ul className="space-y-1 divide-y divide-emerald-100/50 dark:divide-emerald-900/20">
                  {report.createdUsers.map((u, idx) => (
                    <li
                      key={`created-user-${idx}`}
                      className="flex justify-between py-1 first:pt-0 last:pb-0"
                    >
                      <span className="text-foreground font-medium">
                        {u.name}
                      </span>
                      <span className="text-muted-foreground">
                        NIS: {u.nis} {u.class ? `| Kelas: ${u.class}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {report.updatedUsers && report.updatedUsers.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                Daftar Pengguna Diperbarui ({report.updatedUsers.length})
              </p>
              <div className="max-h-[140px] overflow-y-auto rounded-md border border-blue-100 bg-blue-50/20 p-2 text-xs dark:border-blue-900/50 dark:bg-blue-950/5">
                <ul className="space-y-1 divide-y divide-blue-100/50 dark:divide-blue-900/20">
                  {report.updatedUsers.map((u, idx) => (
                    <li
                      key={`updated-user-${idx}`}
                      className="flex justify-between py-1 first:pt-0 last:pb-0"
                    >
                      <span className="text-foreground font-medium">
                        {u.name}
                      </span>
                      <span className="text-muted-foreground">
                        NIS: {u.nis} {u.class ? `| Kelas: ${u.class}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Error */}
      {report.errors && report.errors.length > 0 && (
        <Alert
          variant="destructive"
          className="animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm font-bold">
            {isSuccess
              ? "Catatan: Beberapa baris gagal divalidasi"
              : "Detail Kesalahan:"}
          </AlertTitle>
          <AlertDescription className="mt-2 max-h-[200px] overflow-y-auto pr-1">
            <ul className="list-disc space-y-1.5 pl-4 text-xs">
              {report.errors.map((err, idx) => (
                <li key={`import-err-${idx}`}>{err}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Badge tipe hasil */}
      {isSuccess && (
        <div className="flex flex-wrap gap-2">
          {report.totalCreated > 0 && (
            <Badge
              variant="outline"
              className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              ✅ {report.totalCreated} baru
            </Badge>
          )}
          {report.totalUpdated > 0 && (
            <Badge
              variant="outline"
              className="border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
            >
              {report.totalUpdated} Diperbarui
            </Badge>
          )}
          {report.totalFailed > 0 && (
            <Badge
              variant="outline"
              className="border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300"
            >
              ❌ {report.totalFailed} gagal
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
