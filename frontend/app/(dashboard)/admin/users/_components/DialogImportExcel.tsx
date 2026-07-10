"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-key.constants";
import {
  CheckCircle2,
  FileSpreadsheet,
  Info,
  RefreshCw,
  XCircle,
} from "lucide-react";
import type { AxiosError } from "axios";
import FileUpload from "@/components/common/file-upload";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import userService from "@/services/user.service";
import ImportReportDetail, { type ImportReport } from "./ImportReportDetail";

interface DialogImportExcelProps {
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogImportExcel({
  open,
  handleChangeAction,
}: DialogImportExcelProps) {
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [isReportMode, setIsReportMode] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mutasi pemanggilan API Import
  const { mutate: mutateImport, isPending } = useMutation({
    mutationFn: (formData: FormData) => userService.importUsers(formData),
    onSuccess: (response) => {
      const data = response.data?.data as ImportReport | undefined;
      if (data) {
        setReport(data);
      }
      setIsSuccess(true);
      setIsReportMode(true);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
    },
    onError: (error: AxiosError<{ message?: string; errors?: string[] }>) => {
      const errorData = error?.response?.data;
      const errorList: string[] = Array.isArray(errorData?.errors)
        ? errorData.errors
        : errorData?.message
          ? [errorData.message]
          : ["Terjadi kesalahan yang tidak diketahui."];

      setReport({
        totalProcessed: 0,
        totalCreated: 0,
        totalUpdated: 0,
        totalSuccess: 0,
        totalFailed: errorList.length,
        errors: errorList,
      });
      setIsSuccess(false);
      setIsReportMode(true);
    },
  });

  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    mutateImport(formData);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setReport(null);
    setIsReportMode(false);
    setIsSuccess(false);
    handleChangeAction(false);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setReport(null);
    setIsReportMode(false);
    setIsSuccess(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        if (!openState && !isPending) {
          handleClose();
        }
      }}
    >
      <DialogContent className="border-border/80 max-h-[90vh] overflow-y-auto shadow-2xl sm:max-w-lg">
        {/* ===== MODE FORM UPLOAD ===== */}
        {!isReportMode && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <FileSpreadsheet className="text-primary h-5 w-5" />
                Import Pengguna via Excel
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Gunakan fitur ini untuk mendaftarkan banyak pengguna sekaligus
                dengan berkas Excel (.xlsx / .xls).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Upload Input Area */}
              <FileUpload
                value={selectedFile}
                onChange={(file) => {
                  setSelectedFile(file);
                }}
                accept=".xlsx, .xls"
                maxSizeMB={5}
                disabled={isPending}
                placeholder="Klik untuk memilih file excel"
                description="Format yang didukung: .xlsx, .xls (Maksimal 5 MB)"
                selectedIcon={
                  <FileSpreadsheet className="h-6 w-6 shrink-0 text-emerald-500" />
                }
              />

              {/* Petunjuk Format Berkas */}
              <Alert className="bg-secondary/40 border-secondary">
                <Info className="text-primary h-4 w-4" />
                <AlertTitle className="flex flex-col justify-between gap-2 text-sm font-semibold sm:flex-row sm:items-center sm:gap-0">
                  Petunjuk Format Kolom Excel:
                  <a
                    href="/templates/user_import_template.xlsx"
                    download
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-background hover:bg-primary/10 h-7 w-full gap-1 px-2 text-xs sm:w-auto"
                    >
                      <FileSpreadsheet className="h-3 w-3" />
                      Unduh Template
                    </Button>
                  </a>
                </AlertTitle>
                <AlertDescription className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  Daftar kolom yang wajib/opsional di dalam berkas:
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    <li>
                      <strong className="text-foreground">Nama</strong> (Wajib)
                    </li>
                    <li>
                      <strong className="text-foreground">NIS</strong> (Wajib,
                      harus angka unik)
                    </li>
                    <li>
                      <strong className="text-foreground">Kelas</strong>{" "}
                      (Opsional, contoh: <code>10 IPA 1</code>)
                    </li>
                    <li>
                      <strong className="text-foreground">Email</strong>{" "}
                      (Opsional)
                    </li>
                    <li>
                      <strong className="text-foreground">Telepon</strong>{" "}
                      (Opsional)
                    </li>
                  </ul>
                  <div className="text-primary mt-2 space-y-0 leading-snug font-medium">
                    <p>
                      * Jika NIS sudah terdaftar, data pengguna tersebut akan
                      diperbarui (bukan ditambah baru).
                    </p>
                    <p>
                      * Format kelas angka (10/11/12) otomatis dikonversi ke
                      Romawi (X/XI/XII).
                    </p>
                    <p>
                      * Password default setelah di-import otomatis disamakan
                      dengan NIS masing-masing pengguna.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter className="gap-2 pt-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button
                type="button"
                disabled={!selectedFile || isPending}
                onClick={handleUpload}
                className="bg-primary hover:bg-primary/95 text-primary-foreground w-full min-w-32 font-semibold sm:w-auto"
              >
                {isPending ? (
                  <>
                    <Spinner className="mr-2" />
                    Mengunggah...
                  </>
                ) : (
                  "Mulai Import"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ===== MODE LAPORAN HASIL ===== */}
        {isReportMode && report && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                {isSuccess ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="text-destructive h-5 w-5" />
                )}
                {isSuccess ? "Import Selesai" : "Import Gagal"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {isSuccess
                  ? "Berikut ringkasan hasil proses import data pengguna."
                  : "Terjadi kesalahan saat memproses file Excel. Periksa detail di bawah ini."}
              </DialogDescription>
            </DialogHeader>

            <ImportReportDetail report={report} isSuccess={isSuccess} />

            <DialogFooter className="gap-2 pt-2 sm:gap-2">
              {/* Tombol untuk upload ulang */}
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="w-full gap-2 sm:w-auto"
              >
                <RefreshCw className="h-4 w-4" />
                Import Lagi
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Selesai
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
