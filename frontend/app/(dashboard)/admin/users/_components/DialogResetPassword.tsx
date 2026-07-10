"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { extractErrorMessage } from "@/lib/error-extractor";

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

interface DialogResetPasswordProps {
  currentData: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogResetPassword({
  currentData,
  open,
  onOpenChange,
}: DialogResetPasswordProps) {
  const { mutateAsync: mutateResetPassword, isPending: isResetting } = useMutation({
    mutationFn: () => {
      if (!currentData) throw new Error("Tidak ada data user dipilih");
      return userService.resetPassword(currentData.id);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Konfirmasi Reset Sandi
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            Apakah Anda yakin ingin mereset kata sandi{" "}
            <strong className="text-foreground">&quot;{currentData?.name}&quot;</strong> kembali ke pengaturan default (sama dengan NIS)?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={isResetting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              toast.promise(
                mutateResetPassword().then(() => {
                  onOpenChange(false);
                }),
                {
                  loading: "Mereset sandi...",
                  success: `Kata sandi pengguna "${currentData?.name}" berhasil direset ke default (NIS).`,
                  error: (err) => extractErrorMessage(err, "Gagal Mereset Sandi"),
                }
              );
            }}
            disabled={isResetting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/95"
          >
            {isResetting ? "Mereset..." : "Ya, Reset Sandi"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
