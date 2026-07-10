"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constants";
import type { AxiosError } from "axios";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import userService from "@/services/user.service";
import { User } from "@/types/User";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface DialogDeleteUserProps {
  currentData: User | null;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogDeleteUser({
  currentData,
  open,
  handleChangeAction,
}: DialogDeleteUserProps) {
  const queryClient = useQueryClient();
  const [confirmNis, setConfirmNis] = useState("");
  const { user: currentUser } = useAuth();
  
  const isSelfDeletion = currentData?.nis === currentUser?.nis;

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setConfirmNis("");
    }
    handleChangeAction(isOpen);
  };

  const { mutate: mutateDeleteUser, isPending } = useMutation({
    mutationFn: () => {
      if (!currentData) throw new Error("Tidak ada data user dipilih");
      return userService.deleteUser(currentData.id);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      // Tangkap error detail dari backend (contoh: Self-Deletion / Relasi Transaksi Peminjaman)
      const isNetworkError = error?.code === "ERR_NETWORK";
      const backendMessage = isNetworkError 
        ? "Koneksi ke server gagal. Harap periksa jaringan internet Anda atau hubungi admin."
        : error?.response?.data?.message || error?.message || "Terjadi kesalahan sistem.";
      
      toast.error("Gagal Menghapus Pengguna", {
        description: backendMessage,
        duration: 5000,
      });
    },
    onSuccess: () => {
      toast.success(`Akun "${currentData?.name}" berhasil dihapus.`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS] });
      handleClose(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="border-border shadow-2xl sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
            Konfirmasi Hapus Pengguna
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            Apakah Anda yakin ingin menghapus permanen pengguna bernama{" "}
            <strong className="text-foreground">&quot;{currentData?.name}&quot;</strong> (NIS: {currentData?.nis})?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {isSelfDeletion ? (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle className="text-sm font-bold">Aksi Dilarang!</AlertTitle>
              <AlertDescription className="text-xs">
                Anda tidak diperbolehkan menghapus akun Anda sendiri demi mencegah Anda terkunci dari sistem.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <span className="text-amber-500 text-base leading-none mt-0.5">⚠️</span>
              <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Pengguna tidak akan dapat login kembali dan riwayat yang terikat mungkin terpengaruh.
              </p>
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="confirm-nis">
              Ketik NIS <strong className="text-foreground font-semibold">{currentData?.nis}</strong> untuk mengonfirmasi:
            </FieldLabel>
            <Input
              id="confirm-nis"
              value={confirmNis}
              onChange={(e) => setConfirmNis(e.target.value)}
              placeholder="Masukkan nomor induk"
              className="text-sm border-destructive/30 focus-visible:ring-destructive/30"
              autoComplete="off"
              autoFocus
            />
          </Field>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              mutateDeleteUser();
            }}
            disabled={isPending || confirmNis.trim() !== currentData?.nis || isSelfDeletion}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/95"
          >
            {isPending ? (
              <>
                <Spinner className="mr-2" />
                Menghapus...
              </>
            ) : (
              "Ya, Hapus Permanen"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
